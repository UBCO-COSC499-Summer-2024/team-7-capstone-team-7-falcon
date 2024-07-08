"""
Class for running inference on an image using our pre-trained object detection model.
"""

from pathlib import Path
import onnxruntime as ort
import numpy as np
import cv2


class Inferencer:
    """
    A class for performing object inference using a pre-trained model.

    Args:
        model_path (str): The path to the pre-trained model.
        conf_threshold (float, optional): The confidence threshold for filtering out object predictions. Defaults to 0.4.
        iou_threshold (float, optional): The intersection over union threshold for non-maximum suppression. Defaults to 0.9.
    """

    def __init__(self, model_path, conf_threshold=0.4, iou_threshold=0.9):
        self.conf_threshold = conf_threshold
        self.iou_threshold = iou_threshold

        self.init_session(model_path)
        pass

    def init_session(self, model_path):
        """
        Initializes the inference session with the pre-trained model.

        Args:
            model_path (str): The path to the pre-trained model.
        """
        self.session = ort.InferenceSession(
            model_path, providers=["CPUExecutionProvider"]
        )
        # Input names, shapes, and dimensions
        model_inputs = self.session.get_inputs()
        self.input_names = [input.name for input in model_inputs]
        self.input_shapes = model_inputs[0].shape
        self.input_height, self.input_width = self.input_shapes[2], self.input_shapes[3]
        # Output names and shapes
        model_outputs = self.session.get_outputs()
        self.output_names = [output.name for output in model_outputs]
        self.output_shapes = model_outputs[0].shape

    def __call__(self, image):
        """
        Performs object inference on the input image.

        Args:
            image: The input image.

        Returns:
            Tuple: A tuple containing the bounding boxes, scores, and class IDs of the detected objects.
        """
        image_data = self.preprocess_image(image)
        results = self.session.run(
            None, {self.session.get_inputs()[0].name: image_data}
        )
        self.boxes, self.scores, self.classes = self.postprocess_results(results)
        return self.boxes, self.scores, self.classes

    def preprocess_image(self, image):
        """
        Preprocesses the input image for object inference.

        Args:
            image: The input image to be preprocessed.

        Returns:
            The preprocessed image data.
        """
        self.img_height, self.img_width = image.shape[:2]

        input_img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Resize input image
        input_img = cv2.resize(input_img, (self.input_width, self.input_height))

        # Scale input pixel values to 0 to 1
        input_img = input_img / 255.0
        input_img = input_img.transpose(2, 0, 1)
        image_data = input_img[np.newaxis, :, :, :].astype(np.float32)
        return image_data

    def postprocess_results(self, results):
        """
        Postprocesses the inference results to obtain the bounding boxes, scores, and class IDs of the detected objects.

        Args:
            results: The raw inference results.

        Returns:
            Tuple: A tuple containing the filtered bounding boxes, scores, and class IDs of the detected objects.
        """
        predictions = np.squeeze(results[0]).T

        # Filter out object confidence scores below threshold
        scores = np.max(predictions[:, 4:], axis=1)
        # predictions = predictions[scores > self.conf_threshold, :]

        if len(scores) == 0:
            return [], [], []

        class_ids = np.argmax(predictions[:, 4:], axis=1)

        boxes = self.get_bounding_boxes(predictions)

        indices = cv2.dnn.NMSBoxes(
            boxes, scores, self.conf_threshold, self.iou_threshold
        )

        return boxes[indices], scores[indices], class_ids[indices]

    def get_bounding_boxes(self, predictions):
        """
        Converts the predicted bounding box coordinates to the original image space.

        Args:
            predictions: The predicted bounding box coordinates.

        Returns:
            numpy.ndarray: The converted bounding box coordinates.
        """
        boxes = predictions[:, :4]

        original_shape = np.array(
            [self.input_width, self.input_height, self.input_width, self.input_height]
        )
        boxes = np.divide(boxes, original_shape)
        boxes *= np.array(
            [self.img_width, self.img_height, self.img_width, self.img_height]
        )
        boxes = self.convert_box_coords(boxes)

        return boxes

    def convert_box_coords(self, x):
        """
        Converts the bounding box coordinates from (x, y, w, h) format to (x1, y1, x2, y2) format.

        Args:
            x: The bounding box coordinates in (x, y, w, h) format.

        Returns:
            numpy.ndarray: The converted bounding box coordinates in (x1, y1, x2, y2) format.
        """
        y = np.copy(x)
        y[..., 0] = x[..., 0] - x[..., 2] / 2
        y[..., 1] = x[..., 1] - x[..., 3] / 2
        y[..., 2] = x[..., 0] + x[..., 2] / 2
        y[..., 3] = x[..., 1] + x[..., 3] / 2
        return y

    def run_inference(self, image_path):
        pass


if __name__ == "__main__":
    image = cv2.imread(
        Path(__file__).resolve().parents[2] / "fixtures" / "submission_2-page_1.jpg"
    )

    model_path = (
        Path(__file__).resolve().parents[2]
        / "model_training"
        / "trained_model_onnx"
        / "weights"
        / "best.onnx"
    )

    inferencer = Inferencer(model_path)

    boxes, scores, classes = inferencer(image)

    for box in boxes:
        x1, y1, x2, y2 = box
        print(x1, y1, x2, y2)
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
    cv2.imshow("Inference", image)
    cv2.waitKey(0)
    print(boxes, scores, classes)
