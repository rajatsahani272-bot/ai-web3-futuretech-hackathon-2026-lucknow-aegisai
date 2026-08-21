import express from "express";

import {
  complaints,
  users,
  updateStatus,
  assignDepartment,
} from "../controllers/adminController.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(adminMiddleware);

router.get("/complaints", complaints);

router.get("/users", users);

router.patch(
  "/complaints/:id/status",
  updateStatus
);

router.patch(
  "/complaints/:id/assign",
  assignDepartment
);

export default router;