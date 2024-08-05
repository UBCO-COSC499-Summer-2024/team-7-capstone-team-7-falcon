from pathlib import Path
import onnxruntime as ort
import numpy as np
import cv2
from datetime import datetime

"""
Class for running inference on an image using our pre-trained object detection model.
"""

MODEL_PATH = (
    Path(__file__).resolve().parents[1]
    / "model_training"
    / "trained_model_onnx"
    / "weights"
    / "best.onnx"
)

INFERENCE_CLASSES = [
    "answer",
    "firstname-section",
    "lastname-section",
    "name-chars",
    "orientation-mark",
    "sn-digits",
    "student-num-section",
    "top-page-num",
]


class Inferencer:
    """
    A class for performing object inference using a pre-trained model.

    Args:
        model_path (str): The path to the pre-trained model.
        conf_threshold (float, optional): The confidence threshold for filtering out object predictions. Defaults to 0.4.
        iou_threshold (float, optional): The intersection over union threshold for non-maximum suppression. Defaults to 0.9.
        inference_classes (list, optional): The list of classes that the model can detect. Defaults to ['answer', 'firstname-section', 'lastname-section', 'name-chars', 'orientation-mark', 'sn-digits', 'student-num-section', 'top-page-num'].
    """

    def __init__(
        self,
        model_path=MODEL_PATH,
        conf_threshold=0.1,
        iou_threshold=0.96,
        inference_classes=INFERENCE_CLASSES,
    ):
        self.conf_threshold = conf_threshold
        self.iou_threshold = iou_threshold
        self.inference_classes = inference_classes
        self.init_session(model_path)

    def init_session(self, model_path):
        """
        Initializes the inference session with the pre-trained model.

        Args:
            model_path (str): The path to the pre-trained model.
        """
        try:
            self.session = ort.InferenceSession(
                model_path, providers=["CPUExecutionProvider"]
            )
            # Input names
            model_inputs = self.session.get_inputs()
            self.input_name = model_inputs[0].name
            # Get input shape/Dimensions
            input_shape = model_inputs[0].shape
            self.input_height, self.input_width = input_shape[2], input_shape[3]
        except Exception as e:
            print(f"Error initializing session: {e}")

    def infer(self, image):
        """
        Performs object inference on the input image.

        Args:
            image: The input image.

        Returns:
            Tuple: A tuple containing the bounding boxes, scores, and class IDs of the detected objects.

            NOTE: Scores are the confidence and overlap scores of the detected objects.
                These are currently not used by the rest of the system but are good to have for the future
        """
        try:
            image_data = self.preprocess_image(image)
            results = self.session.run(None, {self.input_name: image_data})
            return self.postprocess_results(results)
        except Exception as e:
            print(f"Error performing inference: {e}")
            return [], [], []

    def preprocess_image(self, image):
        """
        Preprocesses the input image for object inference.

        Args:
            image: The input image to be preprocessed.

        Returns:
            The preprocessed image data.
        """
        try:
            # Get the original image dimensions
            self.img_height, self.img_width = image.shape[:2]

            # Convert image to RGB
            input_img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Resize original image to size expected by the model
            input_img = cv2.resize(input_img, (self.input_width, self.input_height))

            # Scale input pixel values to 0 to 1
            input_img = input_img / 255.0
            # Transpose image to (C, H, W) format (C = channels, H = height, W = width)
            input_img = input_img.transpose(2, 0, 1)
            return input_img[np.newaxis, :, :, :].astype(np.float32)
        except Exception as e:
            print(f"Error preprocessing image: {e}")
            return None

    def postprocess_results(self, results):
        """
        Postprocesses the inference results to obtain the bounding boxes, scores, and class IDs of the detected objects.

        Args:
            results: The raw inference results.

        Returns:
            Tuple: A tuple containing the filtered bounding boxes, scores, and class IDs of the detected objects.
        """
        try:

            # Filter out object confidence scores below threshold
            predictions = np.squeeze(results[0]).T
            scores = np.max(predictions[:, 4:], axis=1)
            valid_indices = scores > self.conf_threshold
            predictions = predictions[valid_indices]
            scores = scores[valid_indices]

            if len(scores) == 0:
                return [], [], []

            class_ids = np.argmax(predictions[:, 4:], axis=1)

            boxes = self.get_bounding_boxes(predictions)

            indices = self.soft_nms(
                boxes, scores, self.iou_threshold, self.conf_threshold
            )
            # indices = cv2.dnn.NMSBoxes(
            #     boxes, scores, self.conf_threshold, self.iou_threshold
            # )

            indices = indices.flatten()

            return boxes[indices], scores[indices], class_ids[indices]
        except Exception as e:
            print(f"Error postprocessing results: {e}")
            return [], [], []

    def calc_iou(self, boxes, areas, i, j):
        """
        Calculates the intersection over union (IoU) of two bounding boxes.

        Args:
            box1: The first bounding box.
            box2: The second bounding box.

        Returns:
            float: The IoU of the two
        """
        inter_x1 = np.maximum(boxes[i, 1], boxes[j:, 1])
        inter_y1 = np.maximum(boxes[i, 0], boxes[j:, 0])
        inter_x2 = np.minimum(boxes[i, 3], boxes[j:, 3])
        inter_y2 = np.minimum(boxes[i, 2], boxes[j:, 2])
        w = np.maximum(0.0, inter_x2 - inter_x1 + 1)
        h = np.maximum(0.0, inter_y2 - inter_y1 + 1)
        intersection = w * h
        overlap = intersection / (areas[i] + areas[j:] - intersection)

        return overlap

    def soft_nms(self, boxes, scores, iouThreshold, conf, sigma=0.1, method="gaussian"):
        """
        Applies Soft Non-Maximum Suppression (Soft-NMS) to the input bounding boxes and scores.
        This algorithm was adapted from the work of Bodla et al. https://doi.org/10.48550/arXiv.1704.04503

        Args:
            boxes (numpy.ndarray): Array of shape (N, 4) representing the bounding boxes coordinates in the format [y1, x1, y2, x2].
            scores (numpy.ndarray): Array of shape (N,) representing the confidence scores for each bounding box.
            iouThreshold (float): Threshold value for IoU (Intersection over Union). Bounding boxes with IoU greater than Nt will be suppressed.
            conf (float): Confidence threshold. Bounding boxes with scores lower than conf will be suppressed.
            sigma (float, optional): Sigma value for the Gaussian method. Defaults to 0.1.
            method (str, optional): Method for Soft-NMS. Can be "linear", "gaussian", or "original". Defaults to "gaussian".

        Returns:
            numpy.ndarray: Array of indices representing the selected bounding boxes after Soft-NMS.

        """
        # indexes concatenate boxes with the last column
        N = boxes.shape[0]
        indexes = np.array([np.arange(N)])
        boxes = np.concatenate((boxes, indexes.T), axis=1)

        # the order of boxes coordinate is [y1,x1,y2,x2]
        y1 = boxes[:, 0]
        x1 = boxes[:, 1]
        y2 = boxes[:, 2]
        x2 = boxes[:, 3]
        areas = (x2 - x1 + 1) * (y2 - y1 + 1)

        for current in range(N):

            next_pos = current + 1

            # get the max score and index in scores[pos:, pos4]
            if current != N - 1:
                max_score = np.max(scores[next_pos:], axis=0)
                max_pos = np.argmax(scores[next_pos:], axis=0)
            else:
                max_score = scores[-1]
                max_pos = 0
            if scores[current] < max_score:
                boxes[current, :], boxes[max_pos + next_pos, :] = (
                    boxes[max_pos + next_pos, :],
                    boxes[current, :],
                )
                scores[current], scores[max_pos + next_pos] = (
                    scores[max_pos + next_pos],
                    scores[current],
                )
                areas[current], areas[max_pos + next_pos] = (
                    areas[max_pos + next_pos],
                    areas[current],
                )

            # calculate the iou.
            iou = self.calc_iou(boxes, areas, current, next_pos)

            # NMS methods: 'linear', 'gaussian', 'original'
            if method == "linear":  # linear
                weight = np.ones(iou.shape)
                weight[iou > iouThreshold] = (
                    weight[iou > iouThreshold] - iou[iou > iouThreshold]
                )
            elif method == "gaussian":  # gaussian
                weight = np.exp(-(iou * iou) / sigma)
            else:  # original NMS
                weight = np.ones(iou.shape)
                weight[iou > iouThreshold] = 0

            scores[next_pos:] = weight * scores[next_pos:]

        inds = (boxes[:, 4][scores > conf]).astype(int)

        return inds

    def get_bounding_boxes(self, predictions):
        """
        Converts the predicted bounding box coordinates to the original image space.

        Args:
            predictions: The predicted bounding box coordinates.

        Returns:
            numpy.ndarray: The converted bounding box coordinates.
        """
        try:
            boxes = predictions[:, :4]

            original_shape = np.array(
                [
                    self.input_width,
                    self.input_height,
                    self.input_width,
                    self.input_height,
                ]
            )
            boxes = np.divide(boxes, original_shape)
            boxes *= np.array(
                [self.img_width, self.img_height, self.img_width, self.img_height]
            )
            boxes = self.convert_box_coords(boxes)

            return boxes
        except Exception as e:
            print(f"Error getting bounding boxes: {e}")
            return []

    def convert_box_coords(self, x):
        """
        Converts the bounding box coordinates from (x, y, w, h) format to (x1, y1, x2, y2) format.

        Args:
            x: The bounding box coordinates in (x, y, w, h) format.

        Returns:
            numpy.ndarray: The converted bounding box coordinates in (x1, y1, x2, y2) format.
        """
        try:
            x[..., 0] -= x[..., 2] / 2
            x[..., 1] -= x[..., 3] / 2
            x[..., 2] += x[..., 0]
            x[..., 3] += x[..., 1]
            return x
        except Exception as e:
            print(f"Error converting box coordinates: {e}")
            return x


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
    start = datetime.now()
    inferencer = Inferencer(model_path)

    boxes, scores, classes = inferencer.infer(image)

    for i, box in enumerate(boxes):
        x1, y1, x2, y2 = map(int, box)
        color = int(
            (classes[i] * 100)
        )  # Using this to break the color and check to make sure classes are properly separated
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, color), 2)
    end = datetime.now()
    cv2.imshow("Inference", cv2.resize(image, (600, 800)))
    cv2.waitKey(0)
    print(f"Time taken: {end - start}")
    print(boxes.__len__())
    print(scores.__len__())
    print(classes.__len__())
