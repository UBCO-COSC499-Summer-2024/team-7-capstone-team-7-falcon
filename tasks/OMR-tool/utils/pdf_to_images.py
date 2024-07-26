from pdf2image import convert_from_path
import logging
from cv2 import imread

logger = logging.getLogger(__name__)


def check_is_pdf(file_path: str) -> bool:
    """Check if the file is a PDF."""
    filepathStr = str(file_path)
    if filepathStr.endswith(".pdf"):
        return True
    if filepathStr.endswith((".png", ".jpg", ".jpeg")):
        return False
    raise ValueError(
        f'File Path "{filepathStr}" does not point to a PDF or allowed image type'
    )


def save_images(images, output_path, num_pages_per_sheet):
    """
    Save a list of images as JPEG files.

    Args:
        images (list): A list of PIL.Image objects representing the images to be saved.
        output_path (str): The path to the directory where the images will be saved.
        num_pages_per_sheet (int): The maximum number of pages per sheet.

    Returns:
        bool: True if the images were saved successfully.

    Raises:
        Exception: If there was an error while saving the images.

    """
    i = 1
    submission_num = 1
    try:
        for image in images:
            if i > num_pages_per_sheet:
                i = 1
                submission_num += 1
            image_path = f"{output_path}/submission_{submission_num}-page_{i}.jpg"
            image.save(image_path, "JPEG")
            i += 1
        logger.info(f"PDF converted to image successfully")
        return True
    except Exception as e:
        logger.error(f"Image saving failed: {e}")
        raise e


def convert_to_images(pdf_path: str) -> list:
    """Converts a PDF file to a list of images, saving each page as a separate image.

    Args:
        pdf_path (str): The path to the PDF file.

    Returns:
        list: A list of images representing each page of the PDF.

    Raises:
        Exception: If the PDF to image conversion fails.

    """
    try:
        if not check_is_pdf(pdf_path):
            logger.warning(f"File is already an image: {pdf_path}")
            return [imread(pdf_path)]  # Return Code 0 if already an image
        images = convert_from_path(pdf_path)
        logger.info(f"PDF converted to image successfully")
        return images
    except Exception as e:
        logger.error(f"PDF to image conversion failed: {e}")
        raise e


if __name__ == "__main__":
    import sys
    import time

    start_time = time.time()
    if len(sys.argv) != 5:
        print(
            "Usage: python pdf_to_images.py <pdf_path: String> <output_path: String> <num_pages_per_sheet: int> <save_images: boolean>"
        )
        sys.exit(1)

    pdf_path = sys.argv[1]
    output_path = sys.argv[2]
    num_pages_per_sheet = int(sys.argv[3])
    if sys.argv[4].lower() not in ["true", "false"]:
        print("save_images must be either 'true' or 'false'")
        sys.exit(1)
    img_save = sys.argv[4].lower() == "true"
    print("Converting PDF to image...")
    result = convert_to_images(pdf_path)
    if result != None and img_save:
        images_saved = save_images(result, output_path, num_pages_per_sheet)
        print(
            f"PDF {pdf_path} converted to image successfully and saved to {output_path}"
        )
    if result == None:
        print(f"File {pdf_path} is already an image, no processing done")
    else:

        print(f"PDF {pdf_path} converted to image successfully")

    print("--- %s seconds ---" % (time.time() - start_time))
