import express from "express";

import {
  signup,
  getDepartments,
  getDepartmentComplaints,
} from "../controllers/departmentController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import departmentMiddleware from "../middleware/departmentMiddleware.js";

const router = express.Router();

router.post(
  "/signup",
  signup
);

router.get(
  "/",
  authMiddleware,
  getDepartments
);

router.get(
  "/complaints",
  departmentMiddleware,
  getDepartmentComplaints
);

export default router;