import logging
from PIL import Image
import os
from pathlib import Path

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
    processed_path = (
    Path(__file__).resolve().parents[4]
    / "backend"
    / "uploads"
    / "exams"
    / "processed_submissions"
)

    try:
        os.path.isdir(os.path.join(processed_path, output_dir))
    except OSError:
        logging.error(
            f"Directory {os.path.join(processed_path, output_dir)} does not exist"
        )
        return

    try:
        pdf_path = os.path.join(f"{processed_path}/{output_dir}", f"{file_name}.pdf")
        logging.info(f"Converting images to PDF: {pdf_path}")   
        if not all(is_pil_image(img) for img in graded_images):
            raise ValueError(
                "All elements in the graded_images must be PIL.Image objects"
            )
        graded_images[0].save(pdf_path, save_all=True, append_images=graded_images[1:])
        logging.info(f"Images converted to PDF successfully")
        return f"{output_dir}/{file_name}.pdf"
    except Exception as e:
        logging.error(f"PDF conversion failed: {e}")
        raise e
