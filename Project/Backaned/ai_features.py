
def categorize_complaint(complaint):
    text = complaint.lower().strip()

    # Priority order is important.
    # Specific civic issues are checked before general words.

    categories = {

        "Road & Potholes": [
            "pothole",
            "potholes",
            "gadda",
            "gaddha",
            "gadde",
            "sadak kharab",
            "road damaged",
            "damaged road",
            "broken road",
            "road damage",
            "road"
        ],

        "Garbage & Sanitation": [
            "garbage",
            "kachra",
            "waste",
            "trash",
            "dirty",
            "sanitation",
            "dustbin",
            "kachre"
        ],

        "Water Supply": [
            "water supply",
            "pani nahi",
            "pani ki supply",
            "pipeline",
            "pipe leak",
            "water leak",
            "leakage",
            "nal"
        ],

        "Street Light": [
            "street light",
            "streetlight",
            "lamp",
            "light not working",
            "light nahi",
            "road light"
        ],

        "Electricity": [
            "electricity",
            "bijli",
            "power cut",
            "power",
            "transformer",
            "current",
            "electric pole"
        ],

        "Drainage": [
            "drain",
            "drainage",
            "naali",
            "nali",
            "sewer",
            "sewage",
            "waterlogging",
            "jalbharav"
        ],

        "Traffic": [
            "traffic jam",
            "traffic signal",
            "signal not working",
            "signal",
            "parking",
            "traffic"
        ]
    }

    # Check categories in the defined priority order
    for category, keywords in categories.items():

        for keyword in keywords:

            if keyword in text:
                return category

    return "Other / General"


# ==============================
# Severity Detection
# ==============================

def detect_severity(complaint):

    text = complaint.lower()

    critical_words = [
        "accident",
        "danger",
        "dangerous",
        "life threatening",
        "major accident",
        "emergency"
    ]

    high_words = [
        "large pothole",
        "big pothole",
        "broken road",
        "major",
        "severe",
        "overflow",
        "waterlogging"
    ]

    for word in critical_words:
        if word in text:
            return "Critical"

    for word in high_words:
        if word in text:
            return "High"

    return "Medium"


# ==============================
# Priority Detection
# ==============================

def detect_priority(severity):

    if severity == "Critical":
        return "Emergency"

    if severity == "High":
        return "High"

    return "Normal"


# ==============================
# Department Suggestion
# ==============================

def suggest_department(category):

    departments = {

        "Road & Potholes":
            "Municipal Road Department",

        "Garbage & Sanitation":
            "Sanitation Department",

        "Water Supply":
            "Water Supply Department",

        "Street Light":
            "Electrical Department",

        "Electricity":
            "Electricity Department",

        "Drainage":
            "Drainage & Sewerage Department",

        "Traffic":
            "Traffic Management Department",

        "Other / General":
            "Municipal Corporation"
    }

    return departments.get(
        category,
        "Municipal Corporation"
    )


# ==============================
# AI Confidence
# ==============================

def calculate_confidence(category):

    if category == "Other / General":
        return 70

    return 96


# ==============================
# AI Description Improvement
# ==============================

def improve_description(complaint):

    complaint = complaint.strip()

    if not complaint:
        return ""

    return (
        f"A civic issue has been reported: {complaint.capitalize()}. "
        "The issue may require attention from the concerned municipal department. "
        "Kindly inspect the reported location, take the necessary action, "
        "and resolve the issue at the earliest."
    )


# ==============================
# Complete AI Analysis
# ==============================

def analyze_complaint(complaint):

    category = categorize_complaint(complaint)

    severity = detect_severity(complaint)

    priority = detect_priority(severity)

    department = suggest_department(category)

    confidence = calculate_confidence(category)

    improved_description = improve_description(complaint)

    return {
        "category": category,
        "severity": severity,
        "priority": priority,
        "department": department,
        "confidence": confidence,
        "improved_description": improved_description
    }