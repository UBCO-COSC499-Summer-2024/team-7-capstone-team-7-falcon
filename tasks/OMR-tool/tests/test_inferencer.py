import pytest
import numpy as np
import cv2
from pathlib import Path
from object_inference.inferencer import Inferencer


@pytest.fixture(scope="module")
def model_path():
    return (
        Path(__file__).resolve().parents[1]
        / "model_training"
        / "trained_with_customs_onnx"
        / "weights"
        / "best.onnx"
    )


@pytest.fixture(scope="module")
def inferencer(model_path):
    return Inferencer(model_path=model_path)


@pytest.fixture(scope="module")
def image():
    image_path = (
        Path(__file__).resolve().parents[1] / "fixtures" / "submission_14-page_1.jpg"
    )
    return cv2.imread(image_path)


def test_initialization(inferencer):
    assert isinstance(inferencer, Inferencer)
    assert hasattr(inferencer, "session")
    assert hasattr(inferencer, "input_name")


def test_preprocess_image(inferencer, image):
    image_data = inferencer.preprocess_image(image)
    assert image_data.shape == (1, 3, inferencer.input_height, inferencer.input_width)
    assert image_data.dtype == np.float32
    assert np.all(image_data >= 0) and np.all(image_data <= 1)


def test_postprocess_results(inferencer):
    dummy_results = np.random.rand(1, 100, 85).astype(np.float32)
    boxes, scores, classes = inferencer.postprocess_results(dummy_results)
    assert isinstance(boxes, np.ndarray)

    assert isinstance(scores, np.ndarray)
    assert isinstance(classes, np.ndarray)


def test_inference(inferencer, image):
    boxes, scores, classes = inferencer.infer(image)
    assert isinstance(boxes, np.ndarray)
    assert boxes.shape[1] == 4
    assert isinstance(scores, np.ndarray)
    assert isinstance(classes, np.ndarray)


if __name__ == "__main__":
    pytest.main()
