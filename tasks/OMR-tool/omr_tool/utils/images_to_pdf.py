import logging
from PIL import Image
import os

logger = logging.getLogger(__name__)


def is_pil_image(image) -> bool:
    """Verifies that image is a PIL.Image object."""
    return isinstance(image, Image.Image)


def convert_to_pdf(graded_images, output_dir, file_name):
    """
    Convert a list of images to a single PDF file.

    Args:
        graded_images (list): A list of PIL.Image objects representing the images to be converted.
        output_dir (str): The path to the directory where the PDF file will be saved.
        file_name (str): The name of the PDF file.

    Returns:
        str: The path to the PDF file.

    Raises:
        Exception: If there was an error while converting the images to a PDF.

    """
    # Ensure the directory for saving exists
    try:
        os.path.isdir(output_dir)
    except OSError:
        return

    try:
        pdf_path = f"{output_dir}/{file_name}.pdf"
        if not all(is_pil_image(img) for img in graded_images):
            raise ValueError(
                "All elements in the graded_images must be PIL.Image objects")
        graded_images[0].save(pdf_path, save_all=True,
                              append_images=graded_images[1:])
        logging.info(f"Images converted to PDF successfully")
        return pdf_path
    except Exception as e:
        logging.error(f"PDF conversion failed: {e}")
        raise e
