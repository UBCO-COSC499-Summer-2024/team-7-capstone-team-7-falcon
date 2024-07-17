import PIL.Image
from omr_tool.omr_pipeline.generate_grades import grade_answer, order_questions
from omr_tool.utils.image_process import generate_bubble_contours, prepare_img
from omr_tool.object_inference.inferencer import Inferencer
import cv2
import numpy as np
from itertools import chain

"""
The primary sequence for OMR grading
"""

def create_answer_key(key_imgs: list):
    """
    Process the answer key for the exam.

    Args:
        key_mgs (list): A list of PIL.Image objects representing the answer key.

    Returns:
        dict: A dictionary of the answer key.

    """
    answer_key = []

    for img in key_imgs:
        page_answers = omr_on_image(img, is_answer_key=True)
        answer_key.append(page_answers)
    
    return answer_key

def mark_submission_page(submission_img: PIL.Image, answer_key: list):
    """
    Mark a single submission page and generate the corresponding results.

    Args:
        submission_img (PIL.Image): The submission image to be marked.
        answer_key (dict): The answer key for the OMR (Optical Mark Recognition) tool.

    Returns:
        tuple: A tuple containing the submission results and the graded image.
            - submission_results (dict): A dictionary containing the following information:
                - "student_id" (str): The ID of the student.
                - "document_path" (str): The path of the document.
                - "score" (int): The total score of the submission.
                - "answers" (dict): A dictionary containing the list of answers.
                    - "answer_list" (list): A list of dictionaries representing each answer.
            - graded_img (PIL.Image): The graded image.

    """
    submission_results = {
        "student_id": None,
        "document_path": None,
        "score": 0,
        "answers": []
    }

    graded_img = omr_on_image(submission_img, answer_key)

    return submission_results, graded_img

def omr_on_image(input_image: PIL.Image, answer_key=None):
    prepped_image = prepare_img(input_image)
    output_image = input_image.copy()
    inference_tool = Inferencer()
    answers = []
    total_score = 0
    boxes, scores, classes = inference_tool.infer(prepped_image)
    question_2d_list = []
    mask = np.zeros(prepped_image.shape[:2], dtype="uint8")
    for i, box in enumerate(boxes):
        if inference_tool.inference_classes[classes[i]] == "answer":
            question_2d_list = order_questions(box, question_2d_list)
    flat_list = [question_bounds for column in question_2d_list for question_bounds in column]
    for question_num, question_bounds in enumerate(flat_list):
            x1, y1, x2, y2 = question_bounds
            mask.fill(0)
            cv2.fillPoly(mask, [np.array([(x1, y1), (x2, y1), (x2, y2), (x1, y2)])], 255)
             # Extract the region of interest from the prepped image
            roi = cv2.bitwise_and(prepped_image, prepped_image, mask=mask)
        
        # Crop the region of interest to remove black background
            roi_cropped = roi[y1:y2, x1:x2]
            bubble_contours = generate_bubble_contours(roi_cropped)
            print(bubble_contours)
            sorted_indices = np.argsort([cv2.boundingRect(i)[0] for i in bubble_contours])
            sorted_contours = [bubble_contours[i] for i in sorted_indices]
            print(sorted_contours)
            if answer_key:
                isCorrect, filled_index = grade_answer(mask, sorted_contours, answer_key[question_num])
                if isCorrect:
                        color = (0, 255, 0)
                        contour_index = filled_index
                else:
                        color = (0, 0, 255)
                        contour_index = answer_key[question_num]
            else: 
                color = (255, 0, 0)
                contour_index = 0
            translated_contour = sorted_contours[contour_index] + [x1, y1]
            cv2.drawContours(output_image, [translated_contour], -1, color, 2)
    return total_score, answers, output_image
                    

    #         color = 255
    #         cv2.rectangle(prepped_image, (x1, y1), (x2, y2), (0, 255, color), 2)
    #         cv2.putText(
    #             prepped_image,
    #             f"{col+1}, {question+1}",
    #             (x1, y1 - 10),
    #             cv2.FONT_HERSHEY_SIMPLEX,
    #             0.9,
    #             (0, 255, color),
    #             2,
    #         )
    # cv2.imshow("Inference", cv2.resize(prepped_image, (600, 800)))
    # cv2.waitKey(0)



if __name__ == "__main__":
    from pathlib import Path
    from omr_tool.utils.pdf_to_images import convert_to_images

    sheet_path = (
        Path(__file__).resolve().parents[2] / "fixtures" / "submission_2-page_1.jpg"
    )
    print(sheet_path)
    images = convert_to_images(sheet_path)
    score, grades, graded_image = omr_on_image(images[0])
    print(grades)
    cv2.imshow("graded", graded_image)
    cv2.waitKey(0)
    
