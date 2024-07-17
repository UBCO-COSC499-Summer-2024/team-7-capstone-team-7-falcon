import PIL.Image
from omr_tool.omr_pipeline.generate_grades import check_answer, order_questions
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

def omr_on_image(input_image: PIL.Image, answer_key=[]):
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
            contour_index = 0
        # Crop the region of interest to remove black background
            roi_cropped = roi[y1:y2, x1:x2]
            bubble_contours = generate_bubble_contours(roi_cropped)
            
            if question_num < len(answer_key):
                isCorrect, filled_index = check_answer(roi_cropped, bubble_contours, answer_key[question_num])
                if isCorrect:
                    color = (0, 255, 0)
                else:
                    color = (0, 0, 255)       
                contour_index = answer_key[question_num]
            else: 
                color = (255, 0, 0)
                contour_index = 0
            translated_contour = bubble_contours[contour_index] + [x1, y1]
            cv2.drawContours(output_image, [translated_contour], -1, color, 2)
    return total_score, answers, output_image



if __name__ == "__main__":
    from pathlib import Path
    from omr_tool.utils.pdf_to_images import convert_to_images
    answer_key = [1, 1, 4, 2, 2, 2, 3, 2, 2, 4, 
                  3, 1, 4, 4, 1, 0, 3, 1, 3, 2, 
                  0, 1, 3, 1, 1, 0, 0, 2, 0, 4, 
                  4, 3, 0, 0, 1, 1, 2, 3, 3, 4, 
                  0, 4, 1, 0, 0, 1, 3, 4, 0, 0, 
                  0, 2, 4, 1, 0, 2, 1, 3, 1, 4, 
                  1, 4, 2, 3, 0, 1, 0, 2, 0, 4, 
                  2, 0, 4, 4, 0, 3, 4, 4, 1, 1, 
                  4, 3, 4, 0, 3, 4, 0, 4, 4, 3, 
                  2, 2, 3, 4, 1, 0, 4, 4, 4, 1]

    sheet_path = (
        Path(__file__).resolve().parents[2] / "fixtures" / "submission_2-page_1.jpg"
    )
    print(sheet_path)
    images = convert_to_images(sheet_path)
    score, grades, graded_image = omr_on_image(images[0], answer_key)
    print(grades)
    cv2.imshow("graded", cv2.resize(graded_image , (800, 1000)))
    cv2.waitKey(0)
    
