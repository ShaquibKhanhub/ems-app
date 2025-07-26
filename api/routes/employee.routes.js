import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller.js";

import { protect, isAdmin } from "../middleware/auth.middleware.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Admin-only actions
router.use(protect, isAdmin);

// Create a new employee
router.post("/", createEmployee);

// Get all employees
router.get("/", getAllEmployees);

// Get employee by ID
router.get("/:id", getEmployeeById);

// Update employee details
router.patch("/:id", updateEmployee);

// Delete employee
router.delete("/:id", deleteEmployee);

export default router;
