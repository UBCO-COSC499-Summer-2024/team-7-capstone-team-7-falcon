import cv2
import numpy as np
import sys

def prepare_img(image):
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





if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Please provide an image path as an argument.")
        sys.exit(1)

    image_path = sys.argv[1]
    image = cv2.imread(image_path)

    prepared_image = prepare_img(image)

    cv2.imshow("Prepared Image", prepared_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()