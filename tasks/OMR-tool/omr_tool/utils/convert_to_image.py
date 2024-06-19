from pdf2image import convert_from_path
import logging
logger = logging.getLogger(__name__)


def convert_to_image(pdf_path, output_path, num_pages_per_sheet):
    try:
        images = convert_from_path(pdf_path)
        try:
            i = 1
            submission_num = 1
            for image in images:
                if i > num_pages_per_sheet:
                    i = 1
                    submission_num += 1
                image.save(f"{output_path}/submission_{submission_num}-page_{i}.jpg", "JPEG")
                i += 1
            
        except (FileNotFoundError, PermissionError, OSError) as e:
            logging.exception(f'Error saving images:\n {str(e)}')
            return 1
    except Exception as e:
        logging.exception(f'Error converting PDF to image:\n {str(e)}')
        return 2
    return 0

if __name__ == "__main__":
    pdf_path = "sample_sheets/20240619103158362.pdf"
    output_path = "sample_sheets/image_output"
    if convert_to_image(pdf_path, output_path, 2) == 0:
        print("PDF converted to image successfully")
    else:
        print("PDF to image conversion failed")