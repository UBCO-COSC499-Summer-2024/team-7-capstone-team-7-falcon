import os
import pytest
from omr_tool.utils.pdf_to_images import convert_to_image, check_is_pdf, save_images


class TestConvertToImage:
    """
    A test class for the `convert_to_image` function.
    """

    PDF_PATH = "sample_sheets/UBC_100_questions.pdf"
    IMG_PATH = "sample_sheets/sample_image.jpg"
    INVALID_TYPE_PATH = "sample_sheets/sample_invalid_type.txt"
    INVALID_PDF_PATH = "sample_sheets/invalid_pdf.pdf"

    @pytest.fixture(scope="class")
    def output_path(self, tmp_path_factory):
        """
        Fixture that returns a temporary output path for saving images.
        """
        return tmp_path_factory.mktemp("image_output")

    def test_file_type_recognized(self):
        """
        Test case to check if the file type is recognized correctly.
        """
        assert check_is_pdf(self.PDF_PATH) == True
        assert check_is_pdf(self.IMG_PATH) == False

    def test_already_image(self):
        """
        Test case to check if the function returns None when the input file is already an image.
        """
        assert convert_to_image(self.IMG_PATH) == None

    def test_convert_to_image_successful(self, output_path):
        """
        Test case to check if the conversion to image is successful.
        """
        images = convert_to_image(self.PDF_PATH)
        assert images is not None
        assert len(images) > 0

        images_saved = save_images(images, output_path, 2)
        assert images_saved == True
        assert len(os.listdir(output_path)) == len(images)

    def test_invalid_file_type(self):
        """
        Test case to check if an exception is raised when an invalid file type is provided.
        """
        # Add your test code here
        with pytest.raises(ValueError):
            check_is_pdf(self.INVALID_TYPE_PATH)

    def test_convert_to_image_invalid_file(self):
        """
        Test case to check if an exception is raised when an invalid PDF path is provided.
        """
        with pytest.raises(Exception):
            convert_to_image(self.INVALID_PDF_PATH)

    def test_save_images_failed(self):
        """
        Test case to check if an exception is raised when saving images to an invalid output path.
        """
        images = convert_to_image(self.PDF_PATH)
        with pytest.raises(Exception):
            save_images(images, "/invalid/output/path", 2)
