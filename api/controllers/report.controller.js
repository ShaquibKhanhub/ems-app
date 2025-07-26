import Attendance from "../models/attendance.model.js";
import Leave from "../models/leave.model.js";
import Payroll from "../models/payroll.model.js";
import Task from "../models/task.model.js";

export const getAttendanceReport = async (req, res) => {
  const report = await Attendance.aggregate([
    { $group: { _id: "$employeeId", totalDays: { $sum: 1 } } },
  ]);
  res.json(report);
};

export const getLeaveStats = async (req, res) => {
  const stats = await Leave.aggregate([
    { $group: { _id: "$employeeId", totalLeaves: { $sum: 1 } } },
  ]);
  res.json(stats);
};

export const getPayrollSummary = async (req, res) => {
  const summary = await Payroll.aggregate([
    { $group: { _id: "$employeeId", totalPaid: { $sum: "$netPay" } } },
  ]);
  res.json(summary);
};

export const getTaskPerformance = async (req, res) => {
  const stats = await Task.aggregate([
    {
      $group: {
        _id: "$assignedTo",
        completed: {
          $sum: {
            $cond: [{ $eq: ["$status", "Completed"] }, 1, 0],
          },
        },
      },
    },
  ]);
  res.json(stats);
};
