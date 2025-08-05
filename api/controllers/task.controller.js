import Task from "../models/task.model.js";

export const assignTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
};

export const getTasksByEmployee = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.params.id });
  res.json(tasks);
};

export const updateTaskStatus = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(task);
};

export const addTaskComment = async (req, res) => {
  const { message, attachment } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const newComment = {
    by: req.user._id, // Set current user
    message,
    attachment,
    timestamp: new Date(),
  };

  task.comments.push(newComment);
  await task.save();

  res.status(201).json({ message: "Comment added", task });
};

export const getAllTasks = async (req, res) => {
  const tasks = await Task.find({ isArchived: false }).populate(
    "assignedTo assignedBy"
  );

  res.json(tasks);
};


export const archiveTask = async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, { isArchived: true });
  res.json({ message: "Task archived" });
};
