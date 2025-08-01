import moment from "moment";
import asyncHandler from "express-async-handler";

// 🔁 Promote or Demote an employee
import User from "../models/user.model.js";
import Employee from "../models/employee.model.js";
import Attendance from "../models/attendance.model.js";
import Leave from "../models/leave.model.js";

// 1. Set Role
export const setRole = async (req, res) => {
  const { userId, role } = req.body;
  if (!["Admin", "Employee"].includes(role))
    return res.status(400).json({ message: "Invalid role" });

  const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
  res.json({ message: `Role updated to ${role}`, user });
};

// 2. Dashboard Stats
export const getDashboardStats = async (req, res) => {
  const totalEmployees = await Employee.countDocuments();
  const totalAdmins = await User.countDocuments({ role: "Admin" });
  const totalLeaves = await Leave.countDocuments();
  const today = moment().startOf("day").toDate();

  const todaysAttendance = await Attendance.countDocuments({
    date: { $gte: today },
  });

  res.json({
    totalEmployees,
    totalAdmins,
    totalLeaves,
    todaysAttendance,
  });
};

export const deleteUserAndEmployee = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const employee = await Employee.findOne({ user: userId });

  // Delete employee first
  if (employee) {
    await employee.deleteOne(); // or remove()
  }

  // Now delete the user
  await user.deleteOne(); // or remove()

  res.status(200).json({ message: "User and linked employee deleted" });
});
