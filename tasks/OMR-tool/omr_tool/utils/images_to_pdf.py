import logging


def conv_to_pdf(graded_images, output_dir, file_name):
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
    try:
        pdf_path = f"{output_dir}/{file_name}.pdf"
        graded_images[0].save(pdf_path, save_all=True,
                              append_images=graded_images[1:])
        logging.info(f"Images converted to PDF successfully")
        return pdf_path
    except Exception as e:
        logging.error(f"PDF conversion failed: {e}")
        raise e
