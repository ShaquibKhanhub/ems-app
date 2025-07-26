import WorkType from "../models/workType.model.js";

// 📌 Create a new work type (Admin only)
export const createWorkType = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  const exists = await WorkType.findOne({ name });
  if (exists) return res.status(400).json({ message: "Work type already exists" });

  const type = await WorkType.create({ name });
  res.status(201).json(type);
};

// 📋 Get all work types (Admin + Employee)
export const getWorkTypes = async (req, res) => {
  const types = await WorkType.find();
  res.json(types);
};
