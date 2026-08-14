import express from "express";
import {
  create,
  getMyComplaints,
  getById,
  update,
  remove,
} from "../controllers/complaintController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, create);

router.get(
  "/my",
  authMiddleware,
  getMyComplaints
);

router.get(
  "/:id",
  authMiddleware,
  getById
);

router.patch(
  "/:id",
  authMiddleware,
  update
);

router.delete(
  "/:id",
  authMiddleware,
  remove
);

export default router;