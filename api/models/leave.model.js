import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  fromDate: {type: Date, required: true},
  endDate: { type: Date, required: true},
  reason: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
});

export default mongoose.model('Leave', leaveSchema);
