import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  month: String,
  year: Number,
  baseSalary: Number,
  bonus: Number,
  deduction: Number,
  netPay: Number,
  payslipUrl: String
});

export default mongoose.model('Payroll', payrollSchema);
