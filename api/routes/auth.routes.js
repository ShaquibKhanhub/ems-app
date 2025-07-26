import express from "express";
import {
  register,
  login,
  logout,
  getUserProfile,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// 🔐 Auth Routes
router.post("/register", register); // Register employee/admin
router.post("/login", login); // Login & set JWT cookie
router.post("/logout", logout); // Clear JWT cookie
router.get("/profile", verifyToken, getUserProfile); // Protected: get current user

// 🔁 Password Reset
router.post("/request-reset", requestPasswordReset); // Send reset email
router.get("/verify-reset/:token", verifyResetToken); // Validate token
router.post("/reset-password", resetPassword); // Set new password

export default router;
