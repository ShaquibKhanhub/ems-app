import moment from "moment";

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

export const deleteUserAndEmployee = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (user) {
      // ✅ If user has an employeeId, delete employee directly
      if (user.employeeId) {
        await Employee.findByIdAndDelete(user.employeeId);
      } else {
        // ✅ Else try to delete employee where userId matches
        await Employee.findOneAndDelete({ userId: user._id });
      }

      return res.json({ message: "User and linked employee deleted" });
    }

    // If user not found
    return res.status(404).json({ message: "User not found" });
  } catch (err) {
    return res.status(500).json({ message: "Deletion failed", error: err.message });
  }
};
