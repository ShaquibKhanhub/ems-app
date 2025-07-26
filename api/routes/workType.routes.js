import express from "express";
import {
  createWorkType,
  getWorkTypes,
} from "../controllers/workType.controller.js";
import { protect, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// All need login
router.use(protect);

// 📋 Get work types (everyone)
router.get("/list", getWorkTypes);

// ➕ Create work type (Admin only)
router.post("/create", isAdmin, createWorkType);

export default router;
