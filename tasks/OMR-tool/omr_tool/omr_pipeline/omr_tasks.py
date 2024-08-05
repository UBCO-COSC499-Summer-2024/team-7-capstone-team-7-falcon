from PIL.Image import Image, fromarray
from omr_tool.omr_pipeline.read_bubbles import (
    generate_bubble_contours,
    find_filled_bubbles,
    order_questions,
    evaluate_answer,
)
from omr_tool.utils.image_process import (
    prepare_img,
    extract_roi,
    draw_bubble_contours,
    threshold_img,
    highlight_error_region,
)
from omr_tool.omr_pipeline.identify_student import extract_and_highlight_student_id
from object_inference.inferencer import Inferencer
import cv2
import numpy as np
import logging

"""
The primary sequence for OMR grading
"""


def create_answer_key(key_imgs: list[Image]) -> list[dict]:
    """
    Process the answer key images for the exam.

    Args:
        key_imgs (list): A list of PIL.Image objects representing the answer key.

    Returns:
        list[dict]: A list of dictionaries containing the answer key.
            "question_num" (int): The question number.
            "correct_answer_indices" (list): A list of the correct answer indices.
    """
    answer_key = []
    try:
        key_imgs = to_np_images(key_imgs)
        first_question_in_page = 1
        for img in key_imgs:
            answer_key.extend(omr_on_key_image(img, first_question_in_page))
            if answer_key != []:
                # Set the first question number on the next page
                first_question_in_page = answer_key[-1]["question_num"] + 1
    except Exception as e:
        logging.error(f"Error creating answer key: {e}")
        return []  # Return an empty list if an error occurs
    return answer_key


def mark_submission_group(
    group_images: list[Image], answer_key: dict
) -> tuple[dict, list[Image]]:
    """
    Mark a single submission group and generate the corresponding results.

    This function takes a list of submission images and an answer key for the OMR (Optical Mark Recognition) tool.
    It marks each submission image, calculates the score, and generates a graded image for each submission.
    The function returns a tuple containing the submission results and the graded images.

    Args:
        group_images (list[Image]): A list of submission images to be marked.
        answer_key (dict): The answer key for the OMR tool.

    Returns:
        tuple: A tuple containing the submission results and the graded images.
            -- submission_results (dict): A dictionary containing the following information:
                -- "student_id" (str): The ID of the student.
                -- "document_path" (str): The path of the document.
                -- "score" (int): The total score of the submission.
                -- "answers" (dict): A dictionary containing the list of answers.
                    -- "errorFlag" (bool): Flag indicating if there was an error.
                    -- "answer_list" (list): A list of dictionaries representing each answer.
                        Each answer is represented as a dictionary with the following keys:
                        -- "question_num" (int): The question number.
                        -- "expected" (str): The expected answer.
                        -- "answered" (str): The student's answer.
                        -- "score" (int): The score for the question.
            -- graded_images (list[Image]): A list of graded images corresponding to each submission.

    Raises:
        ValueError: If the answer key is empty.

    """
    if answer_key == []:
        raise ValueError("Valid answer key is required for grading.")

    submission_results: dict = {
        "student_id": "",
        "document_path": "",
        "score": 0,
        "answers": {"errorFlag": False, "answer_list": []},
    }

    group_images = to_np_images(group_images)

    graded_images: list[Image] = []
    first_question_in_page = 1
    for submission_img in group_images:
        student_id, score, answers, graded_img, flagRaised = omr_on_submission_image(
            submission_img,
            answer_key,
            submission_results["student_id"],
            submission_results["answers"]["errorFlag"],
            first_question_in_page,
        )
        if student_id != "":
            submission_results["student_id"] = student_id
        submission_results["answers"]["answer_list"].extend(answers)
        submission_results["score"] += score
        if flagRaised:
            submission_results["answers"]["errorFlag"] = True
        graded_images.append(graded_img)
        if answers != []:
            first_question_in_page = answers[-1]["question_num"] + 1

    graded_images = to_PIL_images(graded_images)

    # Make the score out of 100
    submission_results["score"] = round(
        submission_results["score"] / len(answer_key) * 100, 2
    )

    return submission_results, graded_images


def infer_bubble_objects(prepped_image: Image) -> tuple[list, list]:
    """
    Infers bubble objects from a prepped image using an inference tool.

    Args:
        prepped_image: The preprocessed image to infer bubble objects from.

    Returns:
        A tuple containing the flat list of question bounds and the student number section.
    """
    try:
        inference_tool = Inferencer()
        boxes, scores, classes = inference_tool.infer(prepped_image)
        student_num_section, question_2d_list = identify_page_details(
            inference_tool, boxes, classes
        )
    except Exception as e:
        logging.error(f"Error during inference: {e}")
        return [], None

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
    input_image: Image,
    answer_key=[],
    student_id="",
    errorFlag=False,
    first_q_in_page=1,
    bubbles_per_q=5,
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
        tuple: A tuple containing the student ID (if identified), total score, list of results, graded image, and error flag.
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
        # NOTE: BELOW IS A TEMPORARY MEASURE FOR CHECKING BOUNDS
        output_image = cv2.rectangle(
            output_image, question_bounds[:2], question_bounds[2:], (0, 255, 0), 2
        )
        color, correct_answers, question_result = evaluate_answer(
            roi_cropped, bubble_contours, answer_key, question_num
        )
        if len(bubble_contours) != bubbles_per_q:
            output_image = highlight_error_region(
                image=output_image, question_bounds=question_bounds
            )
            errorFlag = True
        else:
            for idx in correct_answers:
                try:
                    output_image = draw_bubble_contours(
                        output_image, bubble_contours[idx], question_bounds, color
                    )
                except Exception as e:
                    logging.error(f"Error drawing bubble contours: {e}, {idx}")
                    output_image = highlight_error_region(
                        image=output_image, question_bounds=question_bounds
                    )
                    errorFlag = True
        if question_result["expected"] == question_result["answered"]:
            question_result["score"] = 1
            total_score += question_result["score"]
        results.append(question_result)

    return (
        student_id,
        total_score,
        results,
        output_image,
        errorFlag,
    )


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


def identify_page_details(
    inference_tool: Inferencer, boxes: np.ndarray, classes: list[str]
) -> tuple:
    """
    Identifies the main objects of interest on the page. This includes the student number section and the question bounds.
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
    try:
        if isinstance(images[0], np.ndarray):
            np_images = images
        else:
            np_images = [np.array(img) for img in images]
    except Exception as e:
        logging.error(f"Error converting images to NumPy arrays: {e}")
    return np_images


def to_PIL_images(images: list[np.ndarray]) -> list[Image]:
    """
    Converts a list of NumPy arrays to a list of PIL.Image objects if necessary

    Args:
        images (list): A list of NumPy arrays.

    Returns:
        list: A list of PIL.Image objects.
    """
    try:
        if isinstance(images[0], Image):
            pil_images = images
        else:
            pil_images = [
                fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB)) for img in images
            ]
    except Exception as e:
        logging.error(f"Error converting images to PIL.Image objects: {e}")
    return pil_images


if __name__ == "__main__":
    from pathlib import Path
    from omr_tool.utils.pdf_to_images import convert_to_images

    # sheet_path = Path(__file__).resolve().parents[2] / "fixtures" / "custom.jpg"
    sheet_path = (
        Path(__file__).resolve().parents[2] / "fixtures" / "ubc_submission_100.pdf"
    )

    images = convert_to_images(sheet_path)

    answer_key = create_answer_key(images)
    submission_results, graded_images = mark_submission_group(images, answer_key)
    print(submission_results)
    graded_images = to_np_images(graded_images)
    for img in graded_images:
        cv2.imshow("graded", cv2.resize(img, (800, 1000)))
        cv2.waitKey(0)
