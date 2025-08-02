import Leave from "../models/leave.model.js";
import { sendEmail } from "../utils/email.js";

// leave.controller.js

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("employeeId", "fullName email");
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaves", error });
  }
};

export const applyLeave = async (req, res) => {
  const leave = await Leave.create(req.body);
  res.status(201).json(leave);
};

export const getEmployeeLeaves = async (req, res) => {
  const leaves = await Leave.find({ employeeId: req.params.id });
  res.json(leaves);
};

export const approveLeave = async (req, res) => {
  try {
    let leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave = await leave.populate("employeeId", "email fullName");

    const from = leave.fromDate
      ? new Date(leave.fromDate).toLocaleDateString()
      : "N/A";
    const to = leave.endDate
      ? new Date(leave.endDate).toLocaleDateString()
      : "N/A";

    if (leave.employeeId?.email) {
      try {
        await sendEmail({
          to: leave.employeeId.email,
          subject: "✅ Your Leave Has Been Approved",
          html: `<p>Hello <strong>${leave.employeeId.fullName}</strong>,<br/>
          Your leave request from <strong>${from}</strong> to <strong>${to}</strong> has been <strong>approved</strong>.</p>`,
        });
      } catch (err) {
        console.error("Email send failed:", err.message);
      }
    }

    res.json(leave);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to approve leave", error: err.message });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    let leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );

    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave = await leave.populate("employeeId", "email fullName");

    const from = leave.fromDate
      ? new Date(leave.fromDate).toLocaleDateString()
      : "N/A";
    const to = leave.endDate
      ? new Date(leave.endDate).toLocaleDateString()
      : "N/A";

    if (leave.employeeId?.email) {
      try {
        await sendEmail({
          to: leave.employeeId.email,
          subject: "❌ Your Leave Has Been Rejected",
          html: `<p>Hello <strong>${leave.employeeId.fullName}</strong>,<br/>
          Your leave request from <strong>${from}</strong> to <strong>${to}</strong> has been <strong>rejected</strong>.</p>`,
        });
      } catch (err) {
        console.error("Email send failed:", err.message);
      }
    }

    res.json(leave);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to reject leave", error: err.message });
  }
};
