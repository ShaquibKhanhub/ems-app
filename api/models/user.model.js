import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    default: null,
  },
  username: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ["Admin", "Employee"], default: "Employee" },
});

userSchema.post("findOneAndDelete", async function (doc) {
  if (doc && doc._id) {
    // Delete employee linked to this user
    await Employee.findOneAndDelete({ userId: doc._id });
  }
});

export default mongoose.model("User", userSchema);
