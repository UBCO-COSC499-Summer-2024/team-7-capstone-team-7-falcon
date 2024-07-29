import os
from PIL import Image
import pytest
from unittest.mock import patch
from omr_tool.omr_pipeline.omr_tasks import create_answer_key, mark_submission_group
from omr_tool.utils.pdf_to_images import convert_to_images

class TestOMRTasks:

    UBC_SUB_100_PATH = "fixtures/ubc_submission_100.pdf"
    UBC_SUB_200_PATH = "fixtures/ubc_submission_200.pdf"

    @pytest.fixture(scope="class")
    def ubc_sub_100_images(self):
        """
        Fixture that returns a list of images from UBC submission 1.
        """
        return convert_to_images(self.UBC_SUB_100_PATH)
    
    @pytest.fixture(scope="class")
    def ubc_sub_200_images(self):
        """
        Fixture that returns a list of images from UBC submission 2.
        """
        return convert_to_images(self.UBC_SUB_200_PATH)

    def test_create_answer_key_100(self, ubc_sub_100_images):
        key_images = ubc_sub_100_images
        key = create_answer_key(key_images)
        assert len(key) == 100
        # Test the first question
        assert key[0]['question_num'] == 1
        assert key[0]['correct_answer_indices'] == [1, 3]
        # Test the last question
        assert key[-1]['question_num'] == 100
        assert key[-1]['correct_answer_indices'] == [1]

    def test_create_answer_key_200(self, ubc_sub_200_images):
        key_images = ubc_sub_200_images
        key = create_answer_key(key_images)
        assert len(key) == 200
        # Test the first question on page 1
        assert key[0]['question_num'] == 1
        assert key[0]['correct_answer_indices'] == [4]
        # Test the last question on page 1
        assert key[99]['question_num'] == 100
        assert key[99]['correct_answer_indices'] == [0]
        # Test the first question on page 2
        assert key[100]['question_num'] == 101
        assert key[100]['correct_answer_indices'] == [4]
        # Test the last question on page 2
        assert key[-1]['question_num'] == 200
        assert key[-1]['correct_answer_indices'] == [3]
