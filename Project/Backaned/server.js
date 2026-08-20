const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// TEMPORARY DATABASE
// ===============================

let complaints = [];


// ===============================
// HOME / TEST API
// ===============================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "FixMyCity Backend is running successfully!",
        version: "1.0.0"
    });

});


// ===============================
// AI DESCRIPTION IMPROVEMENT
// ===============================

app.post("/api/ai/improve-description", (req, res) => {

    const { description } = req.body;

    if (!description || description.trim() === "") {

        return res.status(400).json({
            success: false,
            message: "Complaint description is required."
        });

    }

    const original = description.trim();

    const improvedDescription =
        `The citizen is reporting the following issue: ${original}. ` +
        `This issue is causing inconvenience to the public and requires ` +
        `appropriate attention. Kindly investigate the matter and take ` +
        `necessary action to resolve the issue at the earliest.`;

    res.json({

        success: true,

        originalDescription: original,

        improvedDescription: improvedDescription

    });

});


// ===============================
// AI COMPLAINT CATEGORIZATION
// ===============================

app.post("/api/ai/categorize", (req, res) => {

    const { description } = req.body;

    if (!description || description.trim() === "") {

        return res.status(400).json({
            success: false,
            message: "Complaint description is required."
        });

    }

    const text = description.toLowerCase();

    let category = "General Complaint";
    let priority = "Medium";
    let department = "General Support";


    // =========================
    // ROAD
    // =========================

    if (
        text.includes("road") ||
        text.includes("pothole") ||
        text.includes("gaddha") ||
        text.includes("sadak") ||
        text.includes("street")
    ) {

        category = "Road & Infrastructure";

        department = "Municipal Corporation";

    }


    // =========================
    // GARBAGE
    // =========================

    else if (
        text.includes("garbage") ||
        text.includes("waste") ||
        text.includes("kachra") ||
        text.includes("dustbin") ||
        text.includes("cleaning")
    ) {

        category = "Garbage & Waste";

        department = "Sanitation Department";

    }


    // =========================
    // WATER
    // =========================

    else if (
        text.includes("water") ||
        text.includes("pani") ||
        text.includes("pipeline") ||
        text.includes("pipe") ||
        text.includes("leakage")
    ) {

        category = "Water Supply";

        department = "Water Department";

    }


    // =========================
    // ELECTRICITY
    // =========================

    else if (
        text.includes("electricity") ||
        text.includes("bijli") ||
        text.includes("street light") ||
        text.includes("power") ||
        text.includes("light")
    ) {

        category = "Electricity";

        department = "Electricity Department";

    }


    // =========================
    // DRAINAGE
    // =========================

    else if (
        text.includes("drain") ||
        text.includes("drainage") ||
        text.includes("naali") ||
        text.includes("sewer") ||
        text.includes("sewage")
    ) {

        category = "Drainage & Sewerage";

        department = "Drainage Department";

    }


    // =========================
    // PARK
    // =========================

    else if (
        text.includes("park") ||
        text.includes("garden") ||
        text.includes("playground")
    ) {

        category = "Park & Public Spaces";

        department = "Parks Department";

    }


    // =========================
    // PRIORITY
    // =========================

    if (
        text.includes("urgent") ||
        text.includes("emergency") ||
        text.includes("danger") ||
        text.includes("accident") ||
        text.includes("life risk") ||
        text.includes("serious") ||
        text.includes("bahut serious")
    ) {

        priority = "High";

    }

    else if (
        text.includes("suggestion") ||
        text.includes("request") ||
        text.includes("improvement")
    ) {

        priority = "Low";

    }


    res.json({

        success: true,

        category: category,

        priority: priority,

        department: department

    });

});


// ===============================
// SUBMIT COMPLAINT
// ===============================

app.post("/api/complaints", (req, res) => {

    const {
        name,
        email,
        phone,
        location,
        description,
        improvedDescription,
        category,
        priority,
        department
    } = req.body;


    if (!description) {

        return res.status(400).json({

            success: false,

            message: "Complaint description is required."

        });

    }


    const complaint = {

        id: complaints.length + 1,

        name: name || "Anonymous",

        email: email || "",

        phone: phone || "",

        location: location || "",

        description: description,

        improvedDescription:
            improvedDescription || description,

        category:
            category || "General Complaint",

        priority:
            priority || "Medium",

        department:
            department || "General Support",

        status: "Pending",

        createdAt: new Date().toISOString()

    };


    complaints.push(complaint);


    res.status(201).json({

        success: true,

        message: "Complaint submitted successfully!",

        complaint: complaint

    });

});


// ===============================
// GET ALL COMPLAINTS
// ===============================

app.get("/api/complaints", (req, res) => {

    res.json({

        success: true,

        count: complaints.length,

        complaints: complaints

    });

});


// ===============================
// GET SINGLE COMPLAINT
// ===============================

app.get("/api/complaints/:id", (req, res) => {

    const id = Number(req.params.id);

    const complaint =
        complaints.find(item => item.id === id);


    if (!complaint) {

        return res.status(404).json({

            success: false,

            message: "Complaint not found."

        });

    }


    res.json({

        success: true,

        complaint: complaint

    });

});


// ===============================
// UPDATE COMPLAINT STATUS
// ===============================

app.put("/api/complaints/:id/status", (req, res) => {

    const id = Number(req.params.id);

    const { status } = req.body;


    const complaint =
        complaints.find(item => item.id === id);


    if (!complaint) {

        return res.status(404).json({

            success: false,

            message: "Complaint not found."

        });

    }


    const allowedStatuses = [

        "Pending",

        "In Progress",

        "Resolved",

        "Rejected"

    ];


    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({

            success: false,

            message: "Invalid status."

        });

    }


    complaint.status = status;


    res.json({

        success: true,

        message: "Complaint status updated.",

        complaint: complaint

    });

});


// ===============================
// DELETE COMPLAINT
// ===============================

app.delete("/api/complaints/:id", (req, res) => {

    const id = Number(req.params.id);

    const index =
        complaints.findIndex(item => item.id === id);


    if (index === -1) {

        return res.status(404).json({

            success: false,

            message: "Complaint not found."

        });

    }


    const deletedComplaint =
        complaints.splice(index, 1);


    res.json({

        success: true,

        message: "Complaint deleted successfully.",

        complaint: deletedComplaint[0]

    });

});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log("--------------------------------");

    console.log(
        `FixMyCity Backend running on http://localhost:${PORT}`
    );

    console.log("--------------------------------");

});