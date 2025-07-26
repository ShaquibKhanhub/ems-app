import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { setTokenAndCookie } from "../utils/jwt.js";
import { sendEmail } from "../utils/email.js";
import jwt from "jsonwebtoken";

// LOGIN controller
export const login = async (req, res) => {
  const { username, password } = req.body;

  // Find user by username (email)
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  // Compare hashed password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  setTokenAndCookie(user, res); // Sets jwt cookie

  res.status(200).json({
    message: "Login successful",
    user: {
      _id: user._id,
      username: user.username,
      role: user.role,
    },
  });
};

// REGISTER controller
export const register = async (req, res) => {
  const { username, password, employeeId } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser)
    return res.status(400).json({ message: "Username already exists" });

  // ✅ Role logic — first user becomes Admin
  const isAdminExists = await User.findOne({ role: "Admin" });
  const role = isAdminExists ? "Employee" : "Admin";

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ username, passwordHash, role, employeeId });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      _id: user._id,
      username: user.username,
      role: user.role,
    },
  });
};

// LOGOUT controller
export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logged out successfully" });
};

// GET USER PROFILE controller
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).populate("employeeId");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    _id: user._id,
    username: user.username,
    role: user.role,
    employee: user.employeeId, // full employee profile if linked
  });
};

// RESET PASSWORD placeholder
export const requestPasswordReset = async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = jwt.sign({ id: user._id }, process.env.RESET_PASSWORD_SECRET, {
    expiresIn: "15m",
  });

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

  await sendEmail({
    to: user.username, // assuming username is email
    subject: "🔐 Reset your EMS password",
    html: `<p>Click the link below to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>
           <p>This link will expire in 15 minutes.</p>`,
  });

  res.json({ message: "Password reset link sent to email." });
};

// 2. Verify reset token
export const verifyResetToken = async (req, res) => {
  try {
    const decoded = jwt.verify(
      req.params.token,
      process.env.RESET_PASSWORD_SECRET
    );
    res.json({ valid: true, userId: decoded.id });
  } catch {
    res.status(400).json({ valid: false, message: "Invalid or expired token" });
  }
};

// 3. Reset password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashed;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
export const sendTestMail = async (req, res) => {
  try {
    await sendEmail({
      to: "your_email@gmail.com",
      subject: "🧪 Test Email from EMS",
      html: "<h2>Success! email setup works 🎉</h2>",
    });

    res.json({ success: true, message: "Test email sent!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};
