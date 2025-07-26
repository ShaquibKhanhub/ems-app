import Payroll from '../models/payroll.model.js';

export const generatePayroll = async (req, res) => {
  const payroll = await Payroll.create(req.body);
  res.status(201).json(payroll);
};

export const getPayrollByEmployee = async (req, res) => {
  const payrolls = await Payroll.find({ employeeId: req.params.id });
  res.json(payrolls);
};

export const getAllPayrolls = async (req, res) => {
  const records = await Payroll.find().populate('employeeId');
  res.json(records);
};