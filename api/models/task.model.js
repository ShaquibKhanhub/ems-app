import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    title: String,
    description: String,
    dueDate: Date,
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: String,
        attachment: String, // Store URL
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);