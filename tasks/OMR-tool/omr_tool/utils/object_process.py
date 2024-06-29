import cv2
import numpy as np
import sys


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

def bubble_contours(image):
    """
    Function to detect contours for the bubbles in an image.

    Args:
        image (PIL.Image): The image to detect contours in.

    Returns:
        list: A list of contours detected in the image.

    """
    grayscale_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Threshold the image into binary with Otsu's method
    thresh = cv2.threshold(grayscale_img, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
    
    # Find contours
    contours_tuple = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
   
    # Handle different versions of OpenCV
    if len(contours_tuple) == 2:
        all_contours = contours_tuple[0]
    elif len(contours_tuple) == 3:
        all_contours = contours_tuple[1]
    else:
        raise Exception("Contours tuple must have length 2 or 3. Please check the OpenCV version and documentation.")
    
    # all_contours = imutils.grab_contours((contours,))
    
    bubble_contours = []

    for cnt in all_contours:
        approx = cv2.approxPolyDP(cnt, .03 * cv2.arcLength(cnt, True), True)
        
        if cv2.isContourConvex(approx):
            (x, y, w, h) = cv2.boundingRect(cnt)
            aspect_ratio = w / float(h)
            if aspect_ratio >= 0.9 and aspect_ratio <= 1.1:

                bubble_contours.append(cnt)


    return bubble_contours





if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Please provide an image path as an argument.")
        sys.exit(1)

    image_path = sys.argv[1]
    image = cv2.imread(image_path)

    prepared_image = edge_detect_img(image)
    question_contours = bubble_contours(image)

    image_with_contours = image.copy()
    cv2.drawContours(image_with_contours, question_contours, -1, (0, 255, 0), 2)

    cv2.imshow("Prepared Image", prepared_image)
    cv2.imshow("Contoured Image", image_with_contours)
    cv2.waitKey(0)