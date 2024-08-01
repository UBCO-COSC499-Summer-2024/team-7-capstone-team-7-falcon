import cv2
import numpy as np


def generate_bubble_contours(image):
    """
    Function to detect contours for the bubbles in an image.

    Args:
        image (PIL.Image): The image to detect contours in.

    Returns:
        list: A list of contours detected in the image.

    """

    # Find contours
    all_contours = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[
        0
    ]

    bubble_contours = []

    for cnt in all_contours:
        approx = cv2.approxPolyDP(cnt, 0.03 * cv2.arcLength(cnt, True), True)

        if cv2.isContourConvex(approx):
            (x, y, w, h) = cv2.boundingRect(cnt)
            aspect_ratio1 = w / float(h)
            if aspect_ratio1 >= 0.7 and aspect_ratio1 <= 1.3 and w > 10:
                bubble_contours.append(cnt)

    # Sort Contours by x value
    sorted_contours = sorted(bubble_contours, key=lambda cnt: cv2.boundingRect(cnt)[0])
    return sorted_contours


def find_filled_bubbles(img, bubble_contours, threshold=450):
    filled_index = []
    for i, cnt in enumerate(bubble_contours):
        mask = np.zeros(img.shape, dtype="uint8")
        cv2.drawContours(mask, [cnt], -1, 255, -1)
        mask = cv2.bitwise_and(img, img, mask=mask)
        total = cv2.countNonZero(mask)
        if total > threshold:
            filled_index.append(i)
    return filled_index


def evaluate_answer(roi_cropped, bubble_contours, answer_key, question_num):
    if question_num > len(answer_key):
        raise ValueError("Question number exceeds answer key length.")
    correct_answer_indices = answer_key[question_num - 1]["correct_answer_indices"]
    isCorrect, filled_index = check_answer(
        roi_cropped, bubble_contours, correct_answer_indices
    )
    color = (0, 255, 0) if isCorrect else (0, 0, 255)
    score = 0
    if correct_answer_indices == filled_index:
        score = 1
    result = {
        "question_num": question_num,
        "score": score,
        "expected": correct_answer_indices,
        "answered": filled_index,
    }
    return color, correct_answer_indices, result


def check_answer(mask, sorted_bubble_contours, expected_answer, min_threshold=450):
    bubbled = find_filled_bubbles(mask, sorted_bubble_contours, min_threshold)
    if bubbled == expected_answer:
        return True, bubbled
    else:
        return False, bubbled


def order_questions(box, answer_list):
    """
    Orders the answer boxes into a 2D list based on their coordinates.

    Args:
        box (np.ndArray): The coordinates of the box to be inserted.
        answer_list (list): The existing list of answer boxes.

    Returns:
        list: The updated answer list with the box inserted in the correct position, (column and row).
    """
    x1, y1, x2, y2 = map(int, box)
    box_coords = [x1, y1, x2, y2]
    if not answer_list:
        answer_list.append([box_coords])
        return answer_list
    if x2 < answer_list[0][0][0]:
        # Insert new column at the start of the row
        answer_list.insert(0, [box_coords])
        return answer_list
    if x1 > answer_list[-1][0][2]:
        # Append new column at the end of the row
        answer_list.append([box_coords])
        return answer_list
    for i, col in enumerate(answer_list):
        col_x1, col_x2 = col[0][0], col[0][2]
        if abs(col_x1 - x1) / 2 < 10 and abs(col_x2 - x2) / 2 < 10:
            pos_index = 0
            # Insert box in the current column if it fits
            for j, row in enumerate(col):
                if y1 > row[1]:
                    pos_index = j + 1
            col.insert(pos_index, box_coords)
            col.sort(key=lambda b: b[1])
            break
        if x1 > col_x2 and x2 < answer_list[i + 1][0][0]:
            # Insert box between two columns
            answer_list.insert(i + 1, [box_coords])
            break
    return answer_list
