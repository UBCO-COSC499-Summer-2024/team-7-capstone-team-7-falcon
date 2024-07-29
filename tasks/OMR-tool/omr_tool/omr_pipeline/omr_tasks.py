from PIL.Image import Image
from omr_tool.omr_pipeline.read_bubbles import (
    find_filled_bubbles,
    order_questions,
    evaluate_answer,
)
from omr_tool.utils.image_process import (
    generate_bubble_contours,
    prepare_img,
    extract_roi,
    draw_bubble_contours,
    threshold_img,
)
from omr_tool.omr_pipeline.identify_student import extract_and_highlight_student_id
from object_inference.inferencer import Inferencer
import cv2
import numpy as np

"""
The primary sequence for OMR grading
"""


def create_answer_key(key_imgs: list[Image]) -> list[dict]:
    """
    Process the answer key for the exam.

    Args:
        key_imgs (list): A list of PIL.Image objects representing the answer key.

    Returns:
        list[dict]: A list of dictionaries containing the answer key.
    """
    key_imgs = to_np_images(key_imgs)
    answer_key = []
    first_question_in_page = 1
    for img in key_imgs:
        answer_key.extend(omr_on_key_image(img, first_question_in_page))
        if answer_key != []:
            first_question_in_page = answer_key[-1]["question_num"]+1
    return answer_key


def mark_submission_group(
    group_images: list[Image], answer_key: dict
) -> tuple[dict, list[Image]]:
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
    submission_results: dict = {
        "student_id": "",
        "document_path": "",
        "score": 0,
        "answers": {"errorFlag": False, "answer_list": []},
    }

    group_images = to_np_images(group_images)

    if answer_key == []:
        raise ValueError("Answer key is required for grading.")

    graded_images: list[Image] = []
    first_question_in_page = 1
    for submission_img in group_images:
        student_id, score, answers, graded_img, flagRaised = omr_on_submission_image(
            submission_img, answer_key, submission_results["student_id"], submission_results["answers"]["errorFlag"], first_question_in_page
        )
        if student_id != "":
            submission_results["student_id"] = student_id
        submission_results["answers"]["answer_list"].extend(answers)
        submission_results["score"] += score
        if flagRaised:
            submission_results["answers"]["errorFlag"] = True
        graded_images.append(graded_img)
        if answers != []:
            first_question_in_page = answers[-1]["question_num"]+1

    return submission_results, graded_images


def infer_bubble_objects(prepped_image: Image) -> tuple[list, list]:
    """
    Infers bubble objects from a prepped image using an inference tool.

    Args:
        prepped_image: The preprocessed image to infer bubble objects from.

    Returns:
        A tuple containing the flat list of question bounds and the student number section.
    """
    inference_tool = Inferencer()
    boxes, scores, classes = inference_tool.infer(prepped_image)
    student_num_section, question_2d_list = identify_page_details(
        inference_tool, boxes, classes
    )

    flat_question_list = [
        question_bounds for column in question_2d_list for question_bounds in column
    ]

    return flat_question_list, student_num_section


def omr_on_key_image(input_image: Image, first_q_in_page: int) -> list[dict]:
    """
    Processes an image of the answer key to generate a list of answer key entries.

    Args:
        input_image (Image): The input image representing the answer key.
        first_q_in_page (int): The first question number on the page the image is showing.

    Returns:
        list: A list of dictionaries containing the answer key entries.
    """
    prepped_image = prepare_img(input_image)
    question_list, _ = infer_bubble_objects(prepped_image)
    threshed_image = threshold_img(prepped_image)
    generated_key = populate_answer_key(threshed_image, question_list, first_q_in_page)
    return generated_key


def omr_on_submission_image(
    input_image: Image, answer_key=[], student_id="", errorFlag=False, first_q_in_page=1
) -> tuple[str, int, list[dict], Image, bool]:
    """
    Processes a submission image to extract and evaluate answers, and grade the submission.

    Args:
        input_image (Image): The input image representing the submission.
        answer_key (list): The answer key for grading.
        student_id (str): The student ID.
        errorFlag (bool): Flag indicating if there was an error.
        first_q_in_page (int): The first question number on the page.

    Returns:
        tuple: A tuple containing the student ID, total score, list of results, graded image, and error flag.
    """
    prepped_image = prepare_img(input_image)
    output_image = input_image.copy()
    results = []
    total_score = 0
    threshed_image = threshold_img(prepped_image)

    question_list, student_num_section = infer_bubble_objects(prepped_image)

    if student_num_section is not None:
        student_id, output_image = extract_and_highlight_student_id(
            threshed_image, student_num_section, output_image
        )

    for i, question_bounds in enumerate(question_list):
        question_num = first_q_in_page + i
        roi_cropped = extract_roi(threshed_image, question_bounds)
        bubble_contours = generate_bubble_contours(roi_cropped)
        color, correct_answers, question_result = evaluate_answer(
            roi_cropped, bubble_contours, answer_key, question_num
        )
        for idx in correct_answers:
            output_image = draw_bubble_contours(
                output_image, bubble_contours[idx], question_bounds, color
            )
        if question_result["expected"] == question_result["answered"]:
            question_result["score"] = 1
            total_score += question_result["score"]
        results.append(question_result)

    return student_id, total_score, results, output_image, errorFlag, 


def populate_answer_key(image: Image, flat_list: list[dict], first_q_in_page: int):
    """
    Populates the answer key from the list of question bounds.

    Args:
        image: The image containing the questions.
        flat_list (list): The flat list of question bounds.
        first_q_in_page (int): The first question number on the page.

    Returns:
        list: A list of dictionaries representing the answer key.
    """
    answer_key = []
    for i, question_bounds in enumerate(flat_list):
        question_num = first_q_in_page + i
        question_roi = extract_roi(image, question_bounds)
        bubble_contours = generate_bubble_contours(question_roi)
        bubbled = find_filled_bubbles(question_roi, bubble_contours)
        answer_key.append(
            {"question_num": question_num, "correct_answer_indices": bubbled}
        )
    return answer_key


def identify_page_details(inference_tool: Inferencer, boxes: np.ndarray, classes: list[str]) -> tuple:
    """
    Identifies the details of the page, including the student number section and question bounds.

    Args:
        inference_tool (Inferencer): The inference tool used for object detection.
        boxes (list): The list of bounding boxes.
        classes (list): The list of class labels.

    Returns:
        tuple: A tuple containing the student number section and the 2D list of question bounds.
    """
    student_num_section = None
    question_2d_list = []
    for i, box in enumerate(boxes):
        if inference_tool.inference_classes[classes[i]] == "answer":
            question_2d_list = order_questions(box, question_2d_list)
        if inference_tool.inference_classes[classes[i]] == "student-num-section":
            student_num_section = box
    return student_num_section, question_2d_list

def to_np_images(images: list[Image]) -> list[np.ndarray]:  
    """
    Converts a list of PIL.Image objects to a list of NumPy arrays if necessary

    Args:
        images (list): A list of PIL.Image objects.

    Returns:
        list: A list of NumPy arrays.
    """
    if isinstance(images[0], np.ndarray):
        np_images = images
    else:
        np_images = [np.array(img) for img in images]
    return np_images


if __name__ == "__main__":
    from pathlib import Path
    from omr_tool.utils.pdf_to_images import convert_to_images

    sheet_path = (
        Path(__file__).resolve().parents[2] / "fixtures" / "ubc_submission_200.pdf"
    )

    images = convert_to_images(sheet_path)
       
    answer_key = create_answer_key(images)
    submission_results, graded_images = mark_submission_group(images, answer_key)
    print(submission_results)
    for img in graded_images:
        cv2.imshow("graded", cv2.resize(img, (800, 1000)))
        cv2.waitKey(0)
    
