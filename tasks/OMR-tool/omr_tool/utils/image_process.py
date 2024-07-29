import cv2
import numpy as np
import sys
from pathlib import Path
from PIL import Image

# ALIGNMENT_TEMPLATE = cv2.imread(
#     Path(__file__).resolve().parents[2] / "fixtures" / "template" / "alignment.png",
#     cv2.COLOR_BGR2GRAY,
# )


def prepare_img(image: Image) -> Image:
    """
    Function to preprocess an image for processing.

    Args:
        image (PIL.Image): The image to be prepared.

    Returns:
        PIL.Image: The prepared image.

    """
    grayscale_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    portrait_img = align_img(grayscale_img)
    return portrait_img


def align_img(image: Image) -> Image:
    """
    Function to align an image.

    TODO: Implement a more robust alignment method.

    Args:
        image (PIL.Image): The image to be aligned.

    Returns:
        PIL.Image: The aligned image.

    """
    ogH, ogW = image.shape[:2]

    if ogW > ogH:
        image = cv2.rotate(image, cv2.ROTATE_90_COUNTERCLOCKWISE)
    # grayscale_img = threshold_img(image, blur=False)
    # template = threshold_img(ALIGNMENT_TEMPLATE, blur=False)
    # mask = np.zeros(grayscale_img.shape[:2], dtype="uint8")
    # print(grayscale_img.shape[:2])
    # cv2.rectangle(mask, (newW, 0), (int(newW - np.ceil(newW*0.1)), int(0+np.ceil(newH*0.1))), 255, -1)
    # masked = cv2.bitwise_and(grayscale_img, grayscale_img, mask=mask)
    # cv2.imshow("Mask Applied to Image", masked)
    # cv2.waitKey(0)
    # result = cv2.matchTemplate(masked, template, cv2.TM_CCOEFF_NORMED)
    # w, h = template.shape[::-1]
    # threshold = 0.4
    # loc = np.where(result >= threshold)
    # for pt in zip(*loc[::-1]):
    #     cv2.rectangle(image, pt, (pt[0] + w, pt[1] + h), (0,0,255), 2)
    # image = cv2.resize(image, (ogH, ogW))
    return image


def threshold_img(image):
    """
    Function to threshold an image.

    Args:
        image (PIL.Image): The image to be thresholded.

    Returns:
        PIL.Image: The thresholded image.

    """
    initial_thresh = cv2.threshold(image, 225, 255, cv2.THRESH_BINARY)[1]
    blur_image = cv2.GaussianBlur(initial_thresh, (5, 5), 0)
    thresh = cv2.threshold(blur_image, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[
        1
    ]
    return thresh


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
            if aspect_ratio1 >= 0.8 and aspect_ratio1 <= 1.2 and w > 10:
                bubble_contours.append(cnt)

    # Sort Contours by x value
    sorted_contours = sorted(bubble_contours, key=lambda cnt: cv2.boundingRect(cnt)[0])

    return sorted_contours


def sort_contours(cnts):
    """
    Function to sort contours from top to bottom and left to right.

    Args:
        cnts (list): A list of contours to sort.

    Returns:
        list
    """

    # Sort the contours by y-value
    sorted_contours = sorted(cnts, key=lambda cnt: cv2.boundingRect(cnt)[1])  # y values

    return sorted_contours


def identify_object_contours(generated_contours):
    """
    CURRENTLY UNUSED
    Function to identify objects in an image without using machine learning.
    
    Args:
        contours (list): A list of contours to identify objects in.

    Returns:
        list: A list of objects identified in the image.
    """
    objects = []
    questionCnts = sort_contours(generated_contours)
    row_contours = []
    last_cnt_y = None
    for cnt in questionCnts:
        (x, y, w, h) = cv2.boundingRect(cnt)

        if last_cnt_y is None:
            row_contours.append(cnt)
            last_cnt_y = y

            continue

        if abs(y - last_cnt_y) < h:
            row_contours.append(cnt)
            last_cnt_y = y
            continue

        else:
            sorted_row = sorted(
                row_contours, key=lambda cnt: cv2.boundingRect(cnt)[0]
            )  # x values
            separated_row = []
            last_cnt_x = None
            for row_cnt in sorted_row:
                x, y, w, h = cv2.boundingRect(row_cnt)
                if last_cnt_x is None:
                    separated_row = [row_cnt]
                    last_cnt_x = x
                    continue
                if abs(x - last_cnt_x) < w:
                    separated_row.append(row_cnt)
                    last_cnt_x = x
                    continue
                else:
                    separated_row.append(row_cnt)
                    row_length = len(separated_row)
                    if row_length <= 5:
                        objects.append({"type": "question", "contours": separated_row})
                    elif row_length == 10:
                        objects.append({"type": "SN_digit", "contours": separated_row})
                    elif row_length > 20:
                        objects.append({"type": "name_char", "contours": separated_row})
                    else:
                        objects.append({"type": "name_char", "contours": separated_row})
                    separated_row = [row_cnt]
                last_cnt_x = x
            row_contours = [cnt]
            last_cnt_y = y

    # Add the last set of row_contours if needed
    if row_contours:
        row_length = len(row_contours)
        if row_length <= 5:
            objects.append({"type": "question", "contours": row_contours})
        elif row_length == 10:
            objects.append({"type": "SN_digit", "contours": row_contours})
        elif row_length > 20:
            objects.append({"type": "name_char", "contours": row_contours})
        else:
            objects.append({"type": "name_char", "contours": row_contours})
    return objects


def identify_bubbled(img, cnts):
    """
    Identifies the filled-in bubbles in an image.

    Args:
        img (numpy.ndarray): The input image.
        cnts (list): List of contours representing the bubbles.

    Returns:
        list: List of contours representing the filled-in bubbles.
    """
    bubbled = None
    filled_in = []

    for cnt, i in enumerate(cnts):
        mask = np.zeros(img.shape, dtype="uint8")
        cv2.drawContours(mask, [i], -1, 255, -1)

        mask = cv2.bitwise_and(img, img, mask=mask)
        total = cv2.countNonZero(mask)

        if bubbled is None or total > 400:
            bubbled = (total, cnt)
            filled_in.append(cnts[bubbled[1]])
    return filled_in


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
    if len(sys.argv) < 2:
        print(
            "Please provide an image path as an argument, falling back to placeholder."
        )
        image_path = (
            Path(__file__).resolve().parents[2] / "fixtures" / "submission_2-page_1.jpg"
        )
    else:
        image_path = sys.argv[1]
    image = cv2.imread(image_path)
    # cv2.imshow("aligned", align_img(image))
    # cv2.waitKey(0)
    prepared_image = prepare_img(image)
    question_contours = generate_bubble_contours(prepared_image)
    # objects = identify_object_contours(question_contours)

    image_with_contours = image.copy()

    image_with_bubble = image.copy()

    cv2.drawContours(image_with_contours, question_contours, -1, (255, 255, 0), 2)

    filled_in = identify_bubbled(image, question_contours)

    cv2.drawContours(image_with_bubble, filled_in, -1, (0, 255, 0), 2)
    cv2.imshow("Bubbled Image", cv2.resize(image_with_bubble, (1080, 900)))

    cv2.imshow("Prepared Image", cv2.resize(prepared_image, (800, 800)))
    cv2.imshow("Contoured Image", cv2.resize(image_with_contours, (900, 900)))
    # cv2.imshow("Objects Image", cv2.resize(image_with_objects_identified, (900, 900)))

    cv2.imshow("Contoured Image", image_with_contours)
    cv2.waitKey(0)
