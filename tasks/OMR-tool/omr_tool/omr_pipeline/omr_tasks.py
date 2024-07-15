import PIL.Image
from omr_tool.omr_pipeline.grade_sheet import order_answers
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
    answer_key = {"exam_length": key_imgs.__len__(), "answers": []}

    for img in key_imgs:
        answers = omr_on_image(img, is_key=True)
    
    return answer_key

def process_all_submissions(images: list, submission_grades: dict, answer_key: dict):
    """
    Process a list of images with the OMR pipeline.

    Args:
        images (list): A list of PIL.Image objects representing the images to be processed.

    Returns:
        dict: A dictionary of grades for each student.
        list: A list of combined images per student.

    """
    for image in images:
        isFirst, gradeomr_pipeline(image)
    pass

def omr_on_image(raw_image: PIL.Image, is_key: bool = False):
    prepped_image = prepare_img(raw_image)

    inference_tool = Inferencer()

    boxes, scores, classes = inference_tool.infer(prepped_image)
    answer_list = []
    for i, box in enumerate(boxes):
        if inference_tool.inference_classes[classes[i]] == "answer":
            color = i + 100
            answer_list = order_answers(box, answer_list)
            # print(answer_list)
    
    for col in range(len(answer_list)):
        for question in range(len(answer_list[col])):
            # print(answer_list[col][question])
            x1, y1, x2, y2 = map(int, answer_list[col][question])
            color = 255
            cv2.rectangle(prepped_image, (x1, y1), (x2, y2), (0, 255, color), 2)
            cv2.putText(
                prepped_image,
                f"{col+1}, {question+1}",
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.9,
                (0, 255, color),
                2,
            )
    cv2.imshow("Inference", cv2.resize(prepped_image, (600, 800)))
    cv2.waitKey(0)



if __name__ == "__main__":
    from pathlib import Path
    from omr_tool.utils.pdf_to_images import convert_to_images

    sheet_path = (
        Path(__file__).resolve().parents[2] / "fixtures" / "submission_2-page_1.jpg"
    )
    print(sheet_path)
    images = convert_to_images(sheet_path)
    omr_on_image(images[0])
