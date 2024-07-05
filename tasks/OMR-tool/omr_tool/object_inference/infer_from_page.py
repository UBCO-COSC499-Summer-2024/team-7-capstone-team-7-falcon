import onnxruntime as ort
from PIL import Image
import onnx
import numpy as np
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parents[2] / "model_training" / "trained_model_onnx" / "weights" / 'best.onnx'

def letterbox_image(image, size):
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
    model_image_size = (608, 608)
    boxed_image = letterbox_image(image, tuple(reversed(model_image_size)))
    image_data = np.array(boxed_image, dtype='float32')
    image_data /= 255.
    image_data = np.transpose(image_data, [2, 0, 1])
    image_data = np.expand_dims(image_data, 0)
    return image_data
    
def postprocess_output(output):
    pass

def infer(image):
    session = ort.InferenceSession(MODEL_PATH)
    img_data = preprocess_image(image)
    img_size = np.array([image.size[1], image.size[0]], dtype=np.float32).reshape(1, 2)

if __name__ == '__main__':
    image = Image.open(Path(__file__).resolve().parents[2] / "fixtures" / "submission_2-page_1.jpg")
    
