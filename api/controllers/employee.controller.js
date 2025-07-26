// controllers/employee.controller.js
import Employee from "../models/employee.model.js";

import { sendEmail } from "../utils/email.js"; // Make sure this exists

export const createEmployee = async (req, res) => {
  const employee = await Employee.create(req.body);

  // Send email with employee ID
  await sendEmail({
    to: employee.email,
    subject: "🎉 Welcome to EMS - Your Employee ID",
    html: `
      <h2>Hello ${employee.fullName},</h2>
      <p>You've been added to the EMS system. Your Employee ID is:</p>
      <h3>${employee._id}</h3>
      <p>Please use this ID while registering your account.</p>
      <p>Thanks,<br/>EMS Admin</p>
    `,
  });

  res.status(201).json({
    message: "Employee created and email sent",
    employee,
  });
};

export const getAllEmployees = async (req, res) => {
  const employees = await Employee.find().populate("department");
  res.json(employees);
};

export const getEmployeeById = async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate(
    "department"
  );
  res.json(employee);
};

export const updateEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(employee);
};

export const deleteEmployee = async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
