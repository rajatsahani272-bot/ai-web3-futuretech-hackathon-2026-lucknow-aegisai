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

const router = express.Router();

router.post("/", authMiddleware, create);

router.get(
  "/my",
  authMiddleware,
  getMyComplaints
);
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAll
);
router.get(
  "/:id",
  authMiddleware,
  getById
);

router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  update
);

router.delete(
  "/:id",
  authMiddleware,
  remove
);


export default router;