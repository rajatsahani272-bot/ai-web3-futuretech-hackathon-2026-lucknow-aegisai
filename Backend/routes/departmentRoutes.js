import express from "express";

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/departmentController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAll);

router.get(
  "/:id",
  authMiddleware,
  getById
);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  create
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
  adminMiddleware,
  remove
);

export default router;