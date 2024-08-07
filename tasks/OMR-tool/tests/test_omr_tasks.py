import os
from PIL import Image
import pytest
from unittest.mock import patch
from omr_tool.omr_pipeline.omr_tasks import (
    create_answer_key,
    mark_submission_group,
    populate_answer_key,
)
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

    @pytest.fixture(scope="class")
    def mock_images(self):
        """
        Fixture that returns a list of mock PIL.Image objects.
        """
        return [Image.new("RGB", (100, 100)) for _ in range(3)]

    def test_create_answer_key_100(self, ubc_sub_100_images):
        key_images = ubc_sub_100_images
        key = create_answer_key(key_images)
        assert len(key) == 100
        # Test the first question
        assert key[0]["question_num"] == 1
        assert key[0]["correct_answer_indices"] == [1, 3]
        # Test the last question
        assert key[-1]["question_num"] == 100
        assert key[-1]["correct_answer_indices"] == [1]

    def test_create_answer_key_200(self, ubc_sub_200_images):
        key_images = ubc_sub_200_images
        key = create_answer_key(key_images)
        assert len(key) == 200
        # Test the first question on page 1
        assert key[0]["question_num"] == 1
        assert key[0]["correct_answer_indices"] == [4]
        # Test the last question on page 1
        assert key[99]["question_num"] == 100
        assert key[99]["correct_answer_indices"] == [0]
        # Test the first question on page 2
        assert key[100]["question_num"] == 101
        assert key[100]["correct_answer_indices"] == [4]
        # Test the last question on page 2
        assert key[-1]["question_num"] == 200
        assert key[-1]["correct_answer_indices"] == [3]

    def test_mark_submission_group_ubc100_correct(self, ubc_sub_100_images):
        key_images = ubc_sub_100_images
        key = create_answer_key(key_images)
        submission_images = ubc_sub_100_images
        results, graded_images = mark_submission_group(submission_images, key)
        assert len(graded_images) == 2
        assert results["student_id"] == "13693333"
        assert results["score"] == 100
        # Test result of first question
        assert results["answers"]["answer_list"][0]["question_num"] == 1
        assert (
            results["answers"]["answer_list"][0]["expected"]
            == results["answers"]["answer_list"][0]["answered"]
        )
        # Test result of last question
        assert results["answers"]["answer_list"][-1]["question_num"] == 100
        assert (
            results["answers"]["answer_list"][-1]["expected"]
            == results["answers"]["answer_list"][-1]["answered"]
        )

    def test_mark_submission_group_ubc200_correct(self, ubc_sub_200_images):
        key_images = ubc_sub_200_images
        key = create_answer_key(key_images)
        submission_images = ubc_sub_200_images
        results, graded_images = mark_submission_group(submission_images, key)
        assert len(graded_images) == 2
        assert results["student_id"] == "12437890"
        assert results["score"] == 100
        # Test result of first question
        assert results["answers"]["answer_list"][0]["question_num"] == 1
        assert (
            results["answers"]["answer_list"][0]["expected"]
            == results["answers"]["answer_list"][0]["answered"]
        )
        # Test result of last question
        assert results["answers"]["answer_list"][-1]["question_num"] == 200
        assert (
            results["answers"]["answer_list"][-1]["expected"]
            == results["answers"]["answer_list"][-1]["answered"]
        )

    def test_populate_answer_key(self, mock_images):
        with patch(
            "omr_tool.omr_pipeline.omr_tasks.extract_roi", return_value=mock_images[0]
        ), patch(
            "omr_tool.omr_pipeline.omr_tasks.generate_bubble_contours",
            return_value=[(0, 0, 10, 10)],
        ), patch(
            "omr_tool.omr_pipeline.omr_tasks.find_filled_bubbles", return_value=[0]
        ):
            key = populate_answer_key(mock_images[0], [(0, 0, 10, 10)], 1)
            assert len(key) == 1
            assert key[0]["question_num"] == 1
            assert key[0]["correct_answer_indices"] == [0]
