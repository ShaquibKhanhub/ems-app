import express from "express";
import {
  createDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.controller.js";

import { isAdmin, protect } from "../middleware/auth.middleware.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Protect all department routes — Admin only
router.use(protect, isAdmin);

// Create new department
router.post("/", createDepartment);

// Get all departments
router.get("/", getAllDepartments);

// Update department by ID
router.patch("/:id", updateDepartment);

// Delete department by ID
router.delete("/:id", deleteDepartment);

export default router;
