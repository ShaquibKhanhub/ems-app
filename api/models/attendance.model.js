import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  date: Date,
  clockIn: { type: Date },
  clockOut: { type: Date },
  status: { type: String, enum: ["Present", "Absent", "Leave"] },
});

export default mongoose.model("Attendance", attendanceSchema);
