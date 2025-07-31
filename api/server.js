import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import emailRoutes from "./routes/email.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import taskRoutes from "./routes/task.routes.js";
import payrollRoutes from "./routes/payroll.routes.js";
import reportRoutes from "./routes/report.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import workTypeRoutes from "./routes/workType.routes.js";

dotenv.config();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  })
);
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/employees", employeeRoutes);
app.use("/api/v1/departments", departmentRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/leaves", leaveRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/payroll", payrollRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/work-types", workTypeRoutes);

app.use("/api/email", emailRoutes);
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);

  connectDB();
});
