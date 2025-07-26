import { sendEmail } from "../utils/email.js";
import Employee from "../models/employee.model.js";

// 📤 Send to one email
export const sendToSingle = async (req, res) => {
  const { to, subject, html } = req.body;
  try {
    await sendEmail({ to, subject, html });
    res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    console.error("Single email error:", error);
    res.status(500).json({ success: false, message: "Email failed" });
  }
};

// 📤 Send to all employees
export const sendToAllEmployees = async (req, res) => {
  const { subject, html } = req.body;
  try {
    
    const employees = await Employee.find({}, "email");
    const emails = employees.map((emp) => emp.email);

    const promises = emails.map((email) =>
      sendEmail({ to: email, subject, html })
    );
    await Promise.all(promises);

    res
      .status(200)
      .json({ success: true, message: "Emails sent to all employees" });
  } catch (error) {
    console.error("Bulk email error:", error);
    res.status(500).json({ success: false, message: "Bulk email failed" });
  }
};
