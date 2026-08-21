import express from "express";

import {
    signup,
    getDepartments,
    getDepartmentComplaints,
} from "../controllers/departmentController.js";

import departmentMiddleware from "../middleware/departmentMiddleware.js";

const router = express.Router();


// Department signup

router.post(
    "/signup",
    signup
);


// Get departments

router.get(
    "/",
    departmentMiddleware,
    getDepartments
);


// Department complaints

router.get(
    "/complaints",
    departmentMiddleware,
    getDepartmentComplaints
);

export default router;