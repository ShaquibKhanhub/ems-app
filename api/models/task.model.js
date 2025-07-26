import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  comments: [
    {
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: String,
      attachment: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Task", taskSchema);
