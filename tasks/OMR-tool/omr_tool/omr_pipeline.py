import PIL.Image

"""
The primary sequence for OMR grading
"""

def omr_pipeline(raw_image: PIL.Image) -> None:

    pass


if __name__ == "__main__":
    from pathlib import Path
    from omr_tool.utils.pdf_to_images import convert_to_images
    sheet_path = Path(__file__).resolve().parents[1] / "fixtures" / "submission_2-page_1.jpg"
    print(sheet_path)
    images = convert_to_images(sheet_path)
    omr_pipeline(images[0])