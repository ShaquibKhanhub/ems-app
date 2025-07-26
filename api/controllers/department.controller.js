import Department from '../models/department.model.js';

export const createDepartment = async (req, res) => {
  const department = await Department.create(req.body);
  res.status(201).json(department);
};

export const getAllDepartments = async (req, res) => {
  const departments = await Department.find();
  res.json(departments);
};

export const updateDepartment = async (req, res) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(department);
};

export const deleteDepartment = async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};