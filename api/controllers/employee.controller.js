// controllers/employee.controller.js
import Employee from "../models/employee.model.js";

import { sendEmail } from "../utils/email.js"; // Make sure this exists

export const createEmployee = async (req, res) => {
  try {
    const { fullName, name, email, phone, dob, gender, address, department } =
      req.body;

    const imageUrl = req.files?.photo?.[0]?.path || null;
    const documents = req.files?.documents?.map((file) => file.path) || [];

    const employee = await Employee.create({
      fullName,
      name,
      email,
      phone,
      dob,
      gender,
      address,
      department,
      imageUrl,
      documents,
    });

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
  } catch (err) {
    res.status(500).json({ message: "Creation failed", error: err.message });
  }
};

export const getAllEmployees = async (req, res) => {
  const employees = await Employee.find()
    .populate("department")
    .populate("userId", "username email role ");
  res.json(employees);
};

export const getEmployeeById = async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate(
    "department"
  );
  res.json(employee);
};

export const updateEmployee = async (req, res) => {
  try {
    const updates = {};

    // Basic fields
    if (req.body.fullName) updates.fullName = req.body.fullName;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.phone) updates.phone = req.body.phone;
    if (req.body.gender) updates.gender = req.body.gender; // ✅ Add this

    // Optional department and role
    if (req.body.department) updates.department = req.body.department;
    if (req.body.role) updates.role = req.body.role;

    // Optional photo
    if (req.files?.photo?.[0]) {
      updates.imageUrl = req.files.photo[0].path;
    } else if (req.body.imageUrl) {
      updates.imageUrl = req.body.imageUrl; // ✅ Fallback to body if no file
    }

    // Optional documents
    if (req.files?.documents?.length) {
      updates.documents = req.files.documents.map((file) => file.path);
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};


// export const deleteEmployee = async (req, res) => {
//   await Employee.findByIdAndDelete(req.params.id);
//   res.json({ message: "Deleted" });
// };

export const deleteEmployee = async (req, res) => {
  console.log("Deleting employee with ID:", req.params.id);

  const deleted = await Employee.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: "Employee not found" });
  }

  res.json({ message: "Deleted successfully" });
};
