from PIL import Image
from pathlib import Path
import onnxruntime as ort
import numpy as np

class Inferencer:
    def __init__(self, model_path, conf_threshold=0.4, iou_threshold=0.4):
        self.conf=conf_threshold
        self.iou=iou_threshold

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
        return results

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
        scale = min(w/iw, h/ih)
        nw = int(iw*scale)
        nh = int(ih*scale)

        image = image.resize((nw,nh), Image.BICUBIC)
        new_image = Image.new('RGB', size, (128,128,128))
        new_image.paste(image, ((w-nw)//2, (h-nh)//2))
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
        boxed_image = self.letterbox_image(image, tuple(reversed(self.input_height, self.input_width)))
        image_data = np.array(boxed_image, dtype='float32')
        image_data /= 255.
        image_data = np.transpose(image_data, [2, 0, 1])
        image_data = np.expand_dims(image_data, 0)
        return image_data

    def postprocess_results(self, results):

        predictions = np.squeeze(results[0]).T[np.max(predictions[:, 4:], axis=1) > self.conf_threshold, :]
        scores = scores[scores > self.conf_threshold]

        if len(scores) == 0:
            return [], [], []

        class_ids = np.argmax(predictions[:, 4:], axis=1)

        pass

    def run_inference(self, image_path):
        pass

    
        

    if __name__ == "__main__":
        image = Image.open(Path(__file__).resolve().parents[2] / "fixtures" / "submission_2-page_1.jpg")