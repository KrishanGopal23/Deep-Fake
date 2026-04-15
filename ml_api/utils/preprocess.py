# utils/preprocess.py
def preprocess_image(img, transform):
    return transform(img).unsqueeze(0)