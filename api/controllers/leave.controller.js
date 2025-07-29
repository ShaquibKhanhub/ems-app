import Leave from "../models/leave.model.js";
import { sendEmail } from "../utils/email.js";

// leave.controller.js

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find(); 
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
  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    { status: "Approved" },
    { new: true }
  ).populate("employeeId");

  if (!leave) return res.status(404).json({ message: "Leave not found" });

  const from = leave.fromDate
    ? new Date(leave.fromDate).toLocaleDateString()
    : "N/A";

  const to = leave.endDate
    ? new Date(leave.endDate).toLocaleDateString()
    : "N/A";

  if (leave.employeeId?.email) {
    await sendEmail({
      to: leave.employeeId.email,
      subject: "✅ Your Leave Has Been Approved",
      html: `<p>Your leave request from <strong>${from}</strong> to <strong>${to}</strong> has been <strong>approved</strong>.</p>`,
    });
  }

  res.json(leave);
};

export const rejectLeave = async (req, res) => {
  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    { status: "Rejected" },
    { new: true }
  ).populate("employeeId");

  if (!leave) return res.status(404).json({ message: "Leave not found" });

  const { fromDate, endDate, employeeId } = leave;
  const from = fromDate ? new Date(fromDate).toLocaleDateString() : "N/A";

  const to = endDate ? new Date(endDate).toLocaleDateString() : "N/A";

  if (employeeId?.email) {
    console.log("leave:", leave);
    console.log("leave.fromDate:", leave.fromDate);
    console.log("leave.endDate:", leave.endDate);

    await sendEmail({
      to: employeeId.email,
      subject: "❌ Your Leave Has Been Rejected",
      html: `<p>Your leave request from <strong>${from}</strong> to <strong>${to}</strong> has been <strong>rejected</strong>.</p>`,
    });
  }

  res.json(leave);
};
