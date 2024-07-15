import PIL.Image
from omr_tool.omr_pipeline.generate_grades import order_answers
from omr_tool.utils.image_process import prepare_img
from omr_tool.object_inference.inferencer import Inferencer
import cv2
import numpy as np

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

def mark_submission_page(submission_img: PIL.Image, answer_key: dict):
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

    graded_img = omr_on_image(submission_img)

    return submission_results, graded_img

def omr_on_image(raw_image: PIL.Image, is_answer_key: bool = False):
    prepped_image = prepare_img(raw_image)

    inference_tool = Inferencer()

    boxes, scores, classes = inference_tool.infer(prepped_image)
    answer_list = []
    for i, box in enumerate(boxes):
        if inference_tool.inference_classes[classes[i]] == "answer":
            answer_list = order_answers(box, answer_list)
    
    for col in answer_list:
        for i, question in enumerate(col):
            x1, y1, x2, y2 = map(int, answer_list[col][question])

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
    omr_on_image(images[0])
