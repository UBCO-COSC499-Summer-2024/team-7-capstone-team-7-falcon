import onnxruntime as ort
from PIL import Image
import cv2
import onnx
import numpy as np
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parents[2] / "model_training" / "trained_model_onnx" / "weights" / 'best.onnx'

def letterbox_image(image, size):
    """
    Resize and pad an image to a target size while maintaining aspect ratio.

    Args:
        image (PIL.Image.Image): The input image.
        size (tuple): The target size (width, height) to resize the image to.

    Returns:
        PIL.Image.Image: The resized and padded image.

    """
    iw, ih = image.size
    w, h = size
    scale = min(w/iw, h/ih)
    nw = int(iw*scale)
    nh = int(ih*scale)

    image = image.resize((nw,nh), Image.BICUBIC)
    new_image = Image.new('RGB', size, (128,128,128))
    new_image.paste(image, ((w-nw)//2, (h-nh)//2))
    return new_image

def preprocess_image(image):
    """
    Preprocesses the input image for object inference.

    Args:
        image: The input image to be preprocessed.c

    Returns:
        The preprocessed image data.

    """
    model_image_size = (640, 640)
    boxed_image = letterbox_image(image, tuple(reversed(model_image_size)))
    image_data = np.array(boxed_image, dtype='float32')
    image_data /= 255.
    image_data = np.transpose(image_data, [2, 0, 1])
    image_data = np.expand_dims(image_data, 0)
    return image_data
    
def postprocess(preds, image, confidence=0.4):
    x, protos = preds[0], preds[1]
    x = np.einsum('bcn->bnc', x)
    x = x[np.amax(x[..., 4:-nm], axis=-1) > confidence]
    pass

def infer(image):
    session = ort.InferenceSession(MODEL_PATH)
    img_data = preprocess_image(image)
    img_size = np.array([image.size[1], image.size[0]], dtype=np.float32).reshape(1, 2)
    predictions = session.run(None, {"images": img_data})
    boxes = postprocess(predictions, image)

    print(predictions)
    return results


if __name__ == '__main__':
    image = Image.open(Path(__file__).resolve().parents[2] / "fixtures" / "submission_2-page_1.jpg")
    results = infer(image)
    for r in results:
        boxes = r.boxes
        for box in boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            cv2.rectangle(image, (x1, y1), (x2, y2), (255, 0, 0), 2)
            cls = box.cls[0]
    
