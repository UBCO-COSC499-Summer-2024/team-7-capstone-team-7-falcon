from PIL.Image import Image
from omr_tool.omr_pipeline.read_bubbles import find_filled_bubbles, order_questions, evaluate_answer
from omr_tool.utils.image_process import (
    generate_bubble_contours,
    prepare_img,
    extract_roi,
    draw_bubble_contours
)
from omr_tool.omr_pipeline.identify_student import extract_and_highlight_student_id
from omr_tool.object_inference.inferencer import Inferencer
import cv2

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
    answer_key = []
    first_question_in_page = 1
    for img in key_imgs:
        answer_key.extend(omr_on_key_image(img, first_question_in_page))
        first_question_in_page = answer_key[-1]["question_num"]

    return answer_key


def process_submission_group(
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
        "student_id": None,
        "document_path": None,
        "score": None,
        "answers": {"errorFlag": False, "answer_list": []},
    }

    if answer_key == []:
        raise ValueError("Answer key is required for grading.")

    graded_images: list[Image] = []
    for submission_img in group_images:
        student_id, score, answers, graded_img, flagRaised = omr_on_submission_image(
            submission_img, answer_key
        )
        if student_id != "":
            submission_results["student_id"] = student_id
        submission_results["answers"]["answer_list"].append(answers)
        submission_results["score"] += score
        if flagRaised:
            submission_results["answers"]["errorFlag"] = True

        graded_images.append(graded_img)

    return submission_results, graded_images

def infer_bubble_objects(prepped_image):
    inference_tool = Inferencer()
    boxes, scores, classes = inference_tool.infer(prepped_image)
    student_num_section, question_2d_list = identify_page_details(
        inference_tool, boxes, classes
    )

    flat_question_list = [
        question_bounds for column in question_2d_list for question_bounds in column
    ]

    return flat_question_list, student_num_section

def omr_on_key_image(input_image: Image, first_q_in_page=1):
    prepped_image = prepare_img(input_image)
    question_list, _ = infer_bubble_objects(prepped_image)
    generated_key = populate_answer_key(prepped_image, question_list, first_q_in_page)
    return generated_key

def omr_on_submission_image(input_image: Image, answer_key=[], student_id="", errorFlag=False):
    prepped_image = prepare_img(input_image)
    output_image = input_image.copy()
    results = []
    total_score = 0    

    question_list, student_num_section  = infer_bubble_objects(prepped_image)
    
    if student_num_section is not None:
        student_id, output_image = extract_and_highlight_student_id(prepped_image, student_num_section, output_image)

    for question_num, question_bounds in enumerate(question_list):
        roi_cropped = extract_roi(prepped_image, question_bounds)
        bubble_contours = generate_bubble_contours(roi_cropped)
        color, correct_answers, question_result = evaluate_answer(
            roi_cropped, bubble_contours, answer_key, question_num
        )
        for idx in correct_answers:
            output_image = draw_bubble_contours(
                output_image, bubble_contours[idx], question_bounds, color
            )
        if question_result["expected"] == question_result["answered"]:
            total_score += 1
        results.append(question_result)

    return student_id, total_score, results, output_image, errorFlag


def populate_answer_key(image, flat_list, first_q_in_page):
    answer_key = []
    for i, question_bounds in enumerate(flat_list):
        question_num = first_q_in_page + i
        question_roi = extract_roi(image, question_bounds)
        bubble_contours = generate_bubble_contours(question_roi)
        bubbled = find_filled_bubbles(question_roi, bubble_contours)
        answer_key.append({"question_num": question_num, "correct_answer_indices": bubbled})
    return answer_key


def identify_page_details(inference_tool, boxes, classes):
    student_num_section = None
    question_2d_list = []
    for i, box in enumerate(boxes):
        if inference_tool.inference_classes[classes[i]] == "answer":
            question_2d_list = order_questions(box, question_2d_list)
        if inference_tool.inference_classes[classes[i]] == "student-num-section":
            student_num_section = box
    return student_num_section, question_2d_list


if __name__ == "__main__":
    from pathlib import Path
    from omr_tool.utils.pdf_to_images import convert_to_images

    sheet_path = (
        Path(__file__).resolve().parents[2] / "fixtures" / "submission_2-page_1.jpg"
    )
    print(sheet_path)
    images = convert_to_images(sheet_path)
    answer_key = create_answer_key(images)
    student_id, score, grades, graded_image, errorFlag = omr_on_submission_image(images[0], answer_key)
    print(student_id)
    print(score)
    cv2.imshow("graded", cv2.resize(graded_image, (800, 1000)))
    cv2.waitKey(0)
