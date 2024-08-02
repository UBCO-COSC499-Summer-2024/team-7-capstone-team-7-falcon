import cv2
from numpy import arange, zeros
from omr_tool.utils.image_process import (
    extract_roi,
    draw_bubble_contours,
    highlight_error_region,
)
from omr_tool.omr_pipeline.read_bubbles import generate_bubble_contours
import logging


def extract_and_highlight_student_id(prepped_image, student_num_section, output_image):
    x1, y1, x2, y2 = map(int, student_num_section)
    sid_roi = extract_roi(prepped_image, (x1, y1, x2, y2))
    student_id, id_filled, sid_issue = extract_student_num(sid_roi)
    if student_id == "-1":
        logging.warning(f"Invalid student ID detected in image.")
        output_image = highlight_error_region(
            output_image, map(int, student_num_section), sid_issue
        )
    for cnt in id_filled:
        output_image = draw_bubble_contours(
            output_image, cnt["cnt"], map(int, student_num_section), cnt["col"]
        )
    return student_id, output_image


def extract_student_num(sid_roi):
    student_id = ""
    bubble_contours = generate_bubble_contours(sid_roi)
    sorted_sid_cnts = extract_sid_rows(bubble_contours)
    sid_roi
    id_num = 0
    bubbled = []
    issue_flag = ""
    row_marked = False
    for cnt in sorted_sid_cnts:
        mask = zeros(sid_roi.shape, dtype="uint8")
        cv2.drawContours(mask, [cnt], -1, 255, -1)
        mask = cv2.bitwise_and(sid_roi, sid_roi, mask=mask)
        total = cv2.countNonZero(mask)
        if total > 450:
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
        student_id = "-1"

    return student_id, bubbled, issue_flag


def extract_sid_rows(bubble_contours):
    sorted_cnts = sorted(bubble_contours, key=lambda cnt: cv2.boundingRect(cnt)[1])
    for cnt in arange(0, len(sorted_cnts), 10):
        sorted_cnts[cnt : cnt + 10] = sorted(
            sorted_cnts[cnt : cnt + 10], key=lambda cnt: cv2.boundingRect(cnt)[0]
        )
    return sorted_cnts