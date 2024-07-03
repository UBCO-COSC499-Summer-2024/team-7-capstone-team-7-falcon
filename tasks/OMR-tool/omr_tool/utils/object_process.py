import cv2
import numpy as np
import sys
from itertools import pairwise

def edge_detect_img(image):
    """
    Function to preprocess an image for processing.

    Args:
        image (PIL.Image): The image to be prepared.

    Returns:
        PIL.Image: The prepared image.

    """
    grayscale_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred_img = cv2.GaussianBlur(grayscale_img, (5, 5), 0)
    edged_img = cv2.Canny(blurred_img, 75, 200)
    return edged_img

def generate_bubble_contours(image):
    """
    Function to detect contours for the bubbles in an image.

    Args:
        image (PIL.Image): The image to detect contours in.

    Returns:
        list: A list of contours detected in the image.

    """
    grayscale_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred_img = cv2.GaussianBlur(grayscale_img, (5, 5), 0)

    # Threshold the image into binary with Otsu's method
    thresh = cv2.threshold(blurred_img, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
    
    # Find contours
    all_contours = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0]

    
    bubble_contours = []

    for cnt in all_contours:
        approx = cv2.approxPolyDP(cnt, 0.03 * cv2.arcLength(cnt, True), True)

        if cv2.isContourConvex(approx):
            (x1, y1, w1, h1) = cv2.boundingRect(cnt)
            aspect_ratio1 = w1 / float(h1)
            if aspect_ratio1 >= 0.8 and aspect_ratio1 <= 1.2 and w1 > 20: # TODO: width checking is just a temporary measure, remove when object detection is implemented 
                bubble_contours.append(cnt)
                

    return bubble_contours



def identify_object_contours(generated_contours):
    """
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
            print()
            continue
        if y - last_cnt_y < 1 and y - last_cnt_y > -1:
            print("y - last_cnt_y", y - last_cnt_y)
            row_contours.append(cnt)
            last_cnt_y = y
        
        else:
            rowlength = len(row_contours)
            if rowlength < 6:
                objects.append({'type': "question", 'contours': row_contours})
            elif rowlength == 10:
                objects.append({'type': "SN_digit", 'contours': row_contours})
            elif rowlength > 20:
                objects.append({'type': "name_char", 'contours': row_contours})
            else: 
                print("Unknown object type")
            row_contours = [cnt]
            last_cnt_y = y
    return objects






if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Please provide an image path as an argument.")
        sys.exit(1)

    image_path = sys.argv[1]
    image = cv2.imread(image_path)

    prepared_image = edge_detect_img(image)
    question_contours = generate_bubble_contours(image)
    objects = identify_object_contours(question_contours)

    image_with_contours = image.copy()
    for obj in objects:
        match obj['type']:
            case "question":
                cv2.drawContours(image_with_contours, obj['contours'], -1, (0, 0, 255), 2)
            case "SN_digit":
                cv2.drawContours(image_with_contours, obj['contours'], -1, (255, 0, 0), 2)
            case "name_char":
                cv2.drawContours(image_with_contours, obj['contours'], -1, (0, 255, 0), 2)
            
    # cv2.drawContours(image_with_contours, question_contours, -1, (0, 255, 0), 2)

    cv2.imshow("Prepared Image", cv2.resize(prepared_image, (800, 800)))
    cv2.imshow("Contoured Image", cv2.resize(image_with_contours, (900, 900)))
    
    # cv2.imshow("Contoured Image", image_with_contours)
    cv2.waitKey(0)