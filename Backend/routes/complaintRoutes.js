import express from "express";

import {
  create,
  getMyComplaints,
  getById,
  update,
  remove,
  getAll,
} from "../controllers/complaintController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create Complaint with Image
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  create
);

// Get User's Complaints
router.get(
  "/my",
  authMiddleware,
  getMyComplaints
);

// Get All Complaints - Admin
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAll
);

// Get Complaint By ID
router.get(
  "/:id",
  authMiddleware,
  getById
);

// Update Complaint - Admin
router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  update
);

// Delete Complaint
router.delete(
  "/:id",
  authMiddleware,
  remove
);

export default router;