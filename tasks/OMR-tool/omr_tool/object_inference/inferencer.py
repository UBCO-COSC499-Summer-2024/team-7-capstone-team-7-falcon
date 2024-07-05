"""
Class for running inference on an image using our pre-trained object detection model.
"""

from PIL import Image
from pathlib import Path
import onnxruntime as ort
import numpy as np
import cv2


class Inferencer:
    def __init__(self, model_path, conf_threshold=0.4, iou_threshold=0.4):
        self.conf_threshold = conf_threshold
        self.iou_threshold = iou_threshold

        self.init_session(model_path)
        pass

    def init_session(self, model_path):
        self.session = ort.InferenceSession(model_path)
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
        image_data = self.preprocess_image(image)
        results = self.session.run(self.output_names, {self.input_names[0]: image_data})
        self.boxes, self.scores, self.classes = self.postprocess_results(results)
        return self.boxes, self.scores, self.classes

    def letterbox_image(self, image, size):
        """
        Resize and pad an image to a target size while maintaining aspect ratio.

        Args:
            image (PIL.Image.Image): The input image.
            size (tuple): The target size (width, height) to resize the image to.

        Returns:
            PIL.Image.Image: The resized and padded image.

        """
        iw, ih = self.img_width, self.img_height
        w, h = size
        scale = min(w / iw, h / ih)
        nw = int(iw * scale)
        nh = int(ih * scale)

        image = image.resize((nw, nh), Image.BICUBIC)
        new_image = Image.new("RGB", size, (128, 128, 128))
        new_image.paste(image, ((w - nw) // 2, (h - nh) // 2))
        return new_image

    def preprocess_image(self, image):
        """
        Preprocesses the input image for object inference.

        Args:
            image: The input image to be preprocessed.c

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

        predictions = np.squeeze(results[0]).T

        # Filter out object confidence scores below threshold
        scores = np.max(predictions[:, 4:], axis=1)
        # predictions = predictions[scores > self.conf_threshold, :]

        if len(scores) == 0:
            return [], [], []

        class_ids = np.argmax(predictions[:, 4:], axis=1)

        boxes = self.get_bounding_boxes(predictions)

        indices = cv2.dnn.NMSBoxes(boxes, scores, self.conf_threshold, self.iou_threshold)

        return boxes[indices], scores[indices], class_ids[indices]


    def get_bounding_boxes(self, predictions):
        boxes = predictions[:, :4]

        original_shape = np.array([self.input_width, self.input_height, self.input_width, self.input_height])
        boxes = np.divide(boxes, original_shape)
        boxes *= np.array([self.img_width, self.img_height, self.img_width, self.img_height])
        boxes = self.convert_box_coords(boxes)

        return boxes
        

    def convert_box_coords(self, x):
        # convert bounding box (x, y, w, h) to (x1, y1, x2, y2)
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

    model_path = Path(__file__).resolve().parents[2] / "model_training" / "trained_model_onnx" / "weights" / 'best.onnx'

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
