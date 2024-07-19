import pytest
from pdf2image import convert_from_path
from omr_tool.utils.images_to_pdf import is_pil_image, convert_to_pdf
from omr_tool.utils.pdf_to_images import check_is_pdf


class TestConvertToPDF:
    """
    A test class for the `convert_to_pdf` function.
    """

    PDF_PATH = "../fixtures/UBC_100_questions.pdf"

    @pytest.fixture(scope="class")
    def output_path(self, tmp_path_factory):
        """
        Fixture that returns a temporary output path for saving pdfs.
        """
        return tmp_path_factory.mktemp("pdf_output")

    def test_file_type_recognized(self):
        """
        Test case to check if the file type is recognized correctly.
        """
        pil_images = convert_from_path(self.PDF_PATH)

        assert is_pil_image(self.PDF_PATH) == False
        assert is_pil_image(pil_images[0]) == True

    def test_convert_to_pdf_successful(self, output_path):
        """
        Test case to check if the conversion to pdf is successful.
        """
        pil_images = convert_from_path(self.PDF_PATH)
        output_pdf_path = convert_to_pdf(pil_images, output_path, "test_pdf")
        assert output_pdf_path is not None
        assert check_is_pdf(output_pdf_path) == True

    def test_convert_to_pdf_failed(self, output_path):
        """
        Test case to check if an exception is raised when trying to save non-PIL.Image objects as pdfs.
        """
        with pytest.raises(Exception):
            convert_to_pdf([self.PDF_PATH], output_path, "test_pdf")
