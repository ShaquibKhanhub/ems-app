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
import upload from "../middleware/multer.js";

const router = express.Router();

// Admin-only actions
router.use(protect, isAdmin);

// Get all employees
router.get("/", getAllEmployees);

// Get employee by ID
router.get("/:id", getEmployeeById);

// Update employee details
router.patch(
  "/:id",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "documents", maxCount: 5 },
  ]),
  updateEmployee
);

// Delete employee
router.delete("/:id", deleteEmployee);

// ✅ Create a new employee (with photo + documents)
router.post(
  "/",
  (req, res, next) => {
    upload.fields([
      { name: "photo", maxCount: 1 },
      { name: "documents", maxCount: 5 },
    ])(req, res, function (err) {
      if (err) {
        return res
          .status(400)
          .json({ message: "Upload Error", error: err.message });
      }
      next();
    });
  },
  createEmployee
);

export default router;
