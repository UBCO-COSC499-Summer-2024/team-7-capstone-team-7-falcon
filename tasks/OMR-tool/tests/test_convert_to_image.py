import os
import pytest
from omr_tool.utils.convert_to_image import convert_to_image

class TestConvertToImage:
    pdf_path = "sample_sheets/UBC_100_questions.pdf"

    @pytest.fixture(scope="class")
    def output_path(self, tmp_path_factory):
        return tmp_path_factory.mktemp("image_output")

    def test_convert_to_image_successful(self, output_path):
        assert convert_to_image(self.pdf_path, output_path, 2) == 0
        assert len(os.listdir(output_path)) == 2

    def test_convert_to_image_failed(self):
        assert convert_to_image(self.pdf_path, "invalid image output path", 2) == 1

    def test_convert_to_image_invalid_pdf(self, output_path):
        assert convert_to_image("invalid PDF path", output_path, 2) == 2
