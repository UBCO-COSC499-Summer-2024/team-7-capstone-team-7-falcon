import PIL.Image
from omr_tool.utils.object_process import prepare_img
from omr_tool.object_inference.inferencer import Inferencer
import cv2
import numpy as np

"""
The primary sequence for OMR grading
"""


def omr_pipeline(raw_image: PIL.Image):
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


def order_answers(box, answer_list):
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


if __name__ == "__main__":
    from pathlib import Path
    from omr_tool.utils.pdf_to_images import convert_to_images

    sheet_path = (
        Path(__file__).resolve().parents[1] / "fixtures" / "submission_2-page_1.jpg"
    )
    print(sheet_path)
    images = convert_to_images(sheet_path)
    omr_pipeline(images[0])
