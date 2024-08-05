import pytest
from PIL import Image
from pdf2image import convert_from_path
from omr_tool.utils.images_to_pdf import is_pil_image, convert_to_pdf
from omr_tool.utils.pdf_to_images import check_is_pdf


class TestConvertToPDF:
    """
    A test class for the `convert_to_pdf` function.
    """

    PDF_PATH = "/fixtures/UBC_100_questions.pdf"

    @pytest.fixture(scope="class")
    def output_path(self, tmp_path_factory):
        """
        Fixture that returns a temporary output path for saving pdfs.
        """
        return tmp_path_factory.mktemp("pdf_output")
    @pytest.fixture(scope="class")
    def pil_images(self):
        """
        Fixture that returns a list of PIL.Image objects.
        """
        return [
            Image.new("RGB", (100, 100), color="red"),
            Image.new("RGB", (200, 200), color="green"),
            Image.new("RGB", (300, 300), color="blue"),
        ]

    def test_convert_to_pdf_successful(self, pil_images, output_path):
        """
        Test case to check if the conversion to pdf is successful. It will throw a FileNotFoundError because the output_path does not exist.
        """
        with pytest.raises(FileNotFoundError):
            output_pdf_path = convert_to_pdf(pil_images, output_path, "test_pdf")
        
        

    def test_convert_to_pdf_failed(self, output_path):
        """
        Test case to check if an exception is raised when trying to save non-PIL.Image objects as pdfs.
        """
        with pytest.raises(Exception):
            convert_to_pdf([self.PDF_PATH], output_path, "test_pdf")
