from flask import Flask, request, jsonify
from flask_cors import CORS

from ai_features import (
    categorize_complaint,
    improve_description
)

app = Flask(__name__)
CORS(app)


# ==========================================
# HOME / SERVER CHECK
# ==========================================

@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "FixMyCity AI Backend is running"
    })


# ==========================================
# AI COMPLAINT ANALYSIS
# ==========================================

@app.route("/api/ai/complaint", methods=["POST"])
def ai_complaint():

    try:
        data = request.get_json()

        # Check request data
        if not data:
            return jsonify({
                "success": False,
                "message": "Request data is missing"
            }), 400

        # Get complaint
        complaint = data.get("complaint", "").strip()

        if not complaint:
            return jsonify({
                "success": False,
                "message": "Complaint is required"
            }), 400

        # ======================================
        # AI CATEGORY
        # ======================================

        category = categorize_complaint(complaint)

        # ======================================
        # AI DESCRIPTION IMPROVEMENT
        # ======================================

        improved_description = improve_description(complaint)

        # ======================================
        # SEVERITY
        # ======================================

        text = complaint.lower()

        critical_words = [
            "accident",
            "danger",
            "dangerous",
            "life",
            "death",
            "fire",
            "emergency",
            "major accident"
        ]

        high_words = [
            "large pothole",
            "big pothole",
            "waterlogging",
            "flood",
            "broken transformer",
            "electric shock",
            "sewer overflow"
        ]

        if any(word in text for word in critical_words):
            severity = "Critical"
            priority = "Emergency"

        elif any(word in text for word in high_words):
            severity = "High"
            priority = "Urgent"

        else:
            severity = "Medium"
            priority = "Normal"

        # ======================================
        # SUGGESTED DEPARTMENT
        # ======================================

        departments = {

            "Road & Potholes":
                "Municipal Road Department",

            "Garbage & Sanitation":
                "Sanitation Department",

            "Water Supply":
                "Water Supply Department",

            "Electricity":
                "Electricity Department",

            "Street Light":
                "Street Light Department",

            "Drainage":
                "Drainage & Sewer Department",

            "Traffic":
                "Traffic Management Department",

            "Other / General":
                "Municipal Corporation"
        }

        department = departments.get(
            category,
            "Municipal Corporation"
        )

        # ======================================
        # AI CONFIDENCE
        # ======================================

        if category == "Other / General":
            confidence = 70
        elif severity == "Critical":
            confidence = 96
        else:
            confidence = 94

        # ======================================
        # FINAL RESPONSE
        # ======================================

        return jsonify({

            "success": True,

            "original_complaint": complaint,

            "category": category,

            "improved_description":
                improved_description,

            "severity": severity,

            "priority": priority,

            "department": department,

            "confidence": confidence

        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "AI analysis failed",
            "error": str(e)
        }), 500


# ==========================================
# TEST API
# ==========================================

@app.route("/api/test", methods=["GET"])
def test_api():

    return jsonify({
        "success": True,
        "message": "AI API is working correctly"
    })


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )