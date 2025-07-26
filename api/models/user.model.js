import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
  username: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['Admin', 'Employee'], default: 'Employee' }
});

export default mongoose.model('User', userSchema);
