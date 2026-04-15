from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import timm

app = Flask(__name__)
CORS(app)

# Load model
model = timm.create_model('efficientnet_b0', pretrained=False)

model.classifier = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(model.classifier.in_features, 2)
)

model.load_state_dict(torch.load("deepfake_model_v2.pth", map_location='cpu'))
model.eval()

# Transform
transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

@app.route("/")
def home():
    return "Deepfake API Running"

@app.route("/predict", methods=['POST'])
def predict():
    file = request.files['file']
    img = Image.open(file).convert('RGB')
    img = transform(img).unsqueeze(0)

    with torch.no_grad():
        output = model(img)
        prob = torch.softmax(output, dim=1)
        confidence, pred = torch.max(prob, 1)

    result = "Fake" if pred.item() == 0 else "Real"

    return jsonify({
        "prediction": result,
        "confidence": round(confidence.item()*100, 2)
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)