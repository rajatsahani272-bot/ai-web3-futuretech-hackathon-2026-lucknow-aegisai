def categorize_complaint(complaint):
    text = complaint.lower()

    categories = {
        "Road & Potholes": [
            "road", "pothole", "gadda", "gaddha", "sadak"
        ],

        "Garbage & Sanitation": [
            "garbage", "kachra", "waste", "sanitation", "dirty"
        ],

        "Water Supply": [
            "water", "pani", "pipeline", "leakage", "nal"
        ],

        "Electricity": [
            "electricity", "bijli", "power", "transformer", "current"
        ],

        "Street Light": [
            "street light", "lamp", "light not working"
        ],

        "Drainage": [
            "drain", "naali", "nali", "sewer", "waterlogging"
        ],

        "Traffic": [
            "traffic", "signal", "parking", "jam"
        ]
    }

    for category, keywords in categories.items():
        for keyword in keywords:
            if keyword in text:
                return category

    return "Other / General"


def improve_description(complaint):
    complaint = complaint.strip()

    if not complaint:
        return ""

    return (
        f"Citizen Complaint: {complaint.capitalize()}. "
        "This issue has been reported for necessary action. "
        "Kindly investigate the matter and take appropriate steps "
        "to resolve the issue at the earliest."
    )