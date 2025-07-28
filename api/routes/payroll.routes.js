import express from "express";
import {
  generatePayroll,
  getPayrollByEmployee,
  getAllPayrolls,
} from "../controllers/payroll.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

// ✅ Create payroll (Admin)
router.post("/generate", protect, isAdmin, generatePayroll);

// ✅ Get all payrolls for an employee
router.get("/employee/:id", protect , getPayrollByEmployee );

// ✅ Get all payrolls (Admin)
router.get("/", protect, isAdmin, getAllPayrolls);

export default router;
