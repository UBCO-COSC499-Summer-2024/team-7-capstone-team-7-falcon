from PIL.Image import Image
from omr_tool.omr_pipeline.read_bubbles import order_questions, evaluate_answer, add_to_key
from omr_tool.utils.image_process import (
    generate_bubble_contours,
    prepare_img,
    threshold_img,
)
from omr_tool.object_inference.inferencer import Inferencer
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
    return [omr_on_key_image(img, student_id="key") for img in key_imgs]


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

def omr_on_key_image(input_image: Image):
    prepped_image = prepare_img(input_image)
    question_list, _ = infer_bubble_objects(prepped_image)
    generated_key = populate_answer_key(prepped_image, question_list)
    return generated_key

def omr_on_submission_image(input_image: Image, answer_key=[], student_id="", errorFlag=False):
    prepped_image = prepare_img(input_image)
    output_image = input_image.copy()
    results = []
    total_score = 0    

    question_list, student_num_section  = infer_bubble_objects(prepped_image)
    
    if student_num_section is not None:
        student_id, id_filled, sid_issue = extract_student_num(prepped_image, student_num_section)
        if student_id == "invalid":
            errorFlag = True
            x1, y1, x2, y2 = map(int, student_num_section)
            cv2.rectangle(output_image, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(output_image, sid_issue, (x1, y1 + 20), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        for cnt in id_filled:
            output_image = draw_bubble_contours(
                output_image, cnt["cnt"], map(int, student_num_section), cnt["col"]
            )
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


def populate_answer_key(image, flat_list):
    answer_key = []
    for question_num, question_bounds in enumerate(flat_list):
        question_roi = extract_roi(image, question_bounds)
        bubble_contours = generate_bubble_contours(question_roi)
        answer_key.append(add_to_key(question_roi, bubble_contours, question_num))
    return answer_key

def extract_page_contours(image, boxes, classes):
    student_num_section = None
    question_2d_list = []
    for i, box in enumerate(boxes):
        if classes[i] == "answer":
            question_2d_list = order_questions(box, question_2d_list)
        if classes[i] == "student-num-section":
            student_num_section = box
    return student_num_section, question_2d_list

def draw_bubble_contours(image, bubble_contour, question_bounds, color):
    """
    Draw the bubble contours on the image.

    Args:
        image (numpy.ndarray): The input image.
        bubble_contours (list): The list of bubble contours.
        question_bounds (tuple): The bounding box coordinates (x1, y1, x2, y2) of the question region.

    Returns:
        numpy.ndarray: The image with the bubble contours drawn.

    """
    output_image = image.copy()
    x1, y1, x2, y2 = question_bounds
    repositioned_cnt = bubble_contour + [x1, y1]
    cv2.drawContours(output_image, [repositioned_cnt], -1, color, 2)
    return output_image


def identify_page_details(inference_tool, boxes, classes):
    student_num_section = None
    question_2d_list = []
    for i, box in enumerate(boxes):
        if inference_tool.inference_classes[classes[i]] == "answer":
            question_2d_list = order_questions(box, question_2d_list)
        if inference_tool.inference_classes[classes[i]] == "student-num-section":
            student_num_section = box
    return student_num_section, question_2d_list


def extract_student_num(image, section):
    x1, y1, x2, y2 = map(int, section)
    student_id = ""

    sid_roi = extract_roi(image, (x1, y1, x2, y2))
    bubble_contours = generate_bubble_contours(sid_roi)
    sorted_sid_cnts = extract_sid_rows(bubble_contours)
    thresh = threshold_img(sid_roi, grayscale=False)
    id_num = 0
    bubbled = []
    issue_flag = ""
    row_marked = False
    for cnt in sorted_sid_cnts:
        mask = np.zeros(thresh.shape, dtype="uint8")
        cv2.drawContours(mask, [cnt], -1, 255, -1)
        mask = cv2.bitwise_and(thresh, thresh, mask=mask)
        total = cv2.countNonZero(mask)
        if total > 500:
            if row_marked:
                bubbled.append({"cnt": cnt, "col": (0, 255, 0)})
                issue_flag = "multiple fills on row"   
            row_marked = True
            student_id += str(id_num)
            bubbled.append({"cnt": cnt, "col": (255, 0, 0)})
        if id_num == 9:
            if not row_marked:
                issue_flag = "no fill on row"
            id_num = 0
            row_marked = False
        else:
            id_num += 1
    if issue_flag:
        student_id = "invalid"

    return student_id, bubbled, issue_flag

def extract_sid_rows(bubble_contours):
    sorted_cnts= sorted(bubble_contours, key=lambda cnt: cv2.boundingRect(cnt)[1])
    for cnt in np.arange(0, len(sorted_cnts), 10):
        sorted_cnts[cnt:cnt+10] = sorted(sorted_cnts[cnt:cnt+10], key=lambda cnt: cv2.boundingRect(cnt)[0])
    return sorted_cnts


def extract_roi(image, question_bounds):
    """
    Extracts the region of interest (ROI) from the given image based on the provided question bounds.

    Parameters:
        image (numpy.ndarray): The input image from which the ROI needs to be extracted.
        question_bounds (tuple): The bounding box coordinates (x1, y1, x2, y2) of the question region.

    Returns:
        numpy.ndarray: The cropped ROI image.

    """
    mask = np.zeros(image.shape[:2], dtype="uint8")
    x1, y1, x2, y2 = question_bounds
    cv2.fillPoly(mask, [np.array([(x1, y1), (x2, y1), (x2, y2), (x1, y2)])], 255)
    roi = cv2.bitwise_and(image, image, mask=mask)
    roi_cropped = roi[y1:y2, x1:x2]
    return roi_cropped


if __name__ == "__main__":
    from pathlib import Path
    from omr_tool.utils.pdf_to_images import convert_to_images

    sheet_path = (
        Path(__file__).resolve().parents[2] / "fixtures" / "submission_2-page_1.jpg"
    )
    print(sheet_path)
    images = convert_to_images(sheet_path)
    answer_key = omr_on_key_image(images[0])
    student_id, score, grades, graded_image, errorFlag = omr_on_submission_image(images[0], answer_key)
    print(student_id)
    print(score)
    cv2.imshow("graded", cv2.resize(graded_image, (800, 1000)))
    cv2.waitKey(0)
