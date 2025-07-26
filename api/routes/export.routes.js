import express from "express";
import {
  exportAttendancePDF,
  exportAttendanceExcel
} from "../controllers/export.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/pdf/:id", protect, exportAttendancePDF);
router.get("/excel/:id", protect, exportAttendanceExcel);

export default router;
