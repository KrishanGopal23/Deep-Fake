import torch
torch.set_num_threads(1)   # 🔥 reduce CPU load

from flask import Flask, request, jsonify
from flask_cors import CORS
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import timm

# -------------------------------
# Initialize Flask App
# -------------------------------
app = Flask(__name__)
CORS(app)

# -------------------------------
# Device (Force CPU for Render)
# -------------------------------
device = torch.device("cpu")

# -------------------------------
# Load Model (ONLY ONCE)
# -------------------------------
print("Loading model...")

model = timm.create_model('efficientnet_b0', pretrained=False)

model.classifier = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(model.classifier.in_features, 2)
)

model.load_state_dict(
    torch.load("deepfake_model_v2.pth", map_location=device)
)

model = model.to(device)
model.eval()

print("Model loaded successfully!")

# -------------------------------
# Image Transform
# -------------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

# -------------------------------
# Home Route
# -------------------------------
@app.route("/")
def home():
    return "Deepfake API Running"

# -------------------------------
# Prediction Route
# -------------------------------
@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']

        # Load image
        img = Image.open(file).convert('RGB')
        img = transform(img).unsqueeze(0)

        # Prediction
        with torch.no_grad():
            output = model(img)
            prob = torch.softmax(output, dim=1)
            confidence, pred = torch.max(prob, 1)

        result = "Fake" if pred.item() == 0 else "Real"

        return jsonify({
            "prediction": result,
            "confidence": round(confidence.item() * 100, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------------
# Run Server (Render Compatible)
# -------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)