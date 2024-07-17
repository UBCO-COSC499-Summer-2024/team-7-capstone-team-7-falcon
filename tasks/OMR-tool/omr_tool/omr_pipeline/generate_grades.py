import cv2
import numpy as np

def check_answer(mask, sorted_bubble_contours, expected_answer):
    bubbled = (200, None)

    for i, cnt in enumerate(sorted_bubble_contours):
        mask = np.zeros(mask.shape, dtype="uint8")
        cv2.drawContours(mask, [cnt], -1, 255, -1)

        mask = cv2.bitwise_and(mask, mask, mask=mask)
        total = cv2.countNonZero(mask)

        if bubbled is None or total > bubbled[0]:
            bubbled = (total, i)
    if bubbled[1] is None:
        return False, None
    if bubbled[1] == expected_answer:
        return True, i
    else:
        return False, i
    

    

def populate_answer_key(answer_key_img):
    pass

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
        col_x1, col_y1, col_x2, col_y2 = col[0]
        if abs(col_x1 - x1)/2 < 10 and abs(col_x2 - x2)/2 < 10:
            pos_index = 0 
            # Insert box in the current column if it fits
            for j, row in enumerate(col):
                if y1 > row[1]:
                    pos_index = j+1    
            col.insert(pos_index, box_coords)
            col.sort(key=lambda b: b[1])
            break
        if x1 > col_x2 and x2 < answer_list[i+1][0][0]:
            # Insert box between two columns
            answer_list.insert(i+1, [box_coords])
            break
    return answer_list

    
