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
    
    for col in range(len(answer_list)):
        for question in range(len(answer_list[col])):
            print(answer_list[col][question])
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
    x1, y1, x2, y2 = map(int, box)
    if answer_list == []:
        answer_list.append([box])
        print(answer_list)
        return answer_list
    for i, col in enumerate(answer_list):
        
        col_x1, col_y1, col_x2, col_y2 = [val for val in col[0]]
        if x2 < col_x1:
            # Insert box at the start of the row
            col.insert(0, [box])
            break
        elif x1 > col_x2:
            # Append box at the end of the row
            col.append([box])
            break
        elif col_x2 <= x1 and (i == len(col) - 1 or col[i + 1][0] >= x2):
            # Insert box in the current column if it fits between
            col.append(box)
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
