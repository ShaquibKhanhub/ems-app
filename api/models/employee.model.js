import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  fullName: { type: String, required: true },
  name: String,
  email: { type: String, unique: true },
  phone: String,
  dob: Date,
  gender: String,
  address: String,
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  documents: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Employee', employeeSchema);
