import PIL.Image
from omr_tool.utils.object_process import prepare_img
from omr_tool.object_inference.inferencer import Inferencer

"""
The primary sequence for OMR grading
"""

def omr_pipeline(raw_image: PIL.Image):
    prepped_image = prepare_img(raw_image)

    inference_tool = Inferencer()

    results = inference_tool.infer(prepped_image)   

    print(results)
    


if __name__ == "__main__":
    from pathlib import Path
    from omr_tool.utils.pdf_to_images import convert_to_images
    sheet_path = Path(__file__).resolve().parents[1] / "fixtures" / "submission_2-page_1.jpg"
    print(sheet_path)
    images = convert_to_images(sheet_path)
    print(images)
    omr_pipeline(images[0])