import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProtectedLayout from "../layouts/ProtectedLayout";
import AdminOnly from "../guards/AdminOnly";
import EmployeeOnly from "../guards/EmployeeOnly";

import AdminLayout from "../layouts/AdminLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

// Admin Pages
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import EmployeeList from "../pages/Employees/EmployeeList";
import CreateEmployee from "../pages/Employees/CreateEmployee";
import DepartmentList from "../pages/Departments/DepartmentList";
import AddDepartment from "../pages/Departments/AddDepartment";
import ApproveRejectLeave from "../pages/Leaves/ApproveRejectLeave";
import AssignTask from "../pages/Tasks/AssignTask";
import ReportPage from "../pages/Reports/ReportPage";

// Employee Pages
import EmployeeDashboard from "../pages/Dashboard/EmployeeDashboard";
import ApplyLeave from "../pages/Leaves/ApplyLeave";
import LeaveList from "../pages/Leaves/LeaveList";
import MarkAttendance from "../pages/Attendance/MarkAttendance";
import MyAttendance from "../pages/Attendance/MyAttendance";
import TaskList from "../pages/Tasks/TaskList";

import NotFound from "../pages/NotFound";
import AdminAttendance from "../pages/Attendance/Admin/AdminView";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        {/* Admin-Only Routes */}
        <Route element={<AdminOnly />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/employees" element={<EmployeeList />} />
            <Route
              path="/admin/employees/create"
              element={<CreateEmployee />}
            />
            <Route path="/admin/departments" element={<DepartmentList />} />
            <Route
              path="/admin/departments/create"
              element={<AddDepartment />}
            />
            <Route path="/admin/leaves" element={<ApproveRejectLeave />} />
            <Route path="/admin/tasks/create" element={<AssignTask />} />
            <Route path="/admin/reports" element={<ReportPage />} />
            <Route path="/admin/attendance" element={<AdminAttendance />} />
            <Route path="/admin/attendance/view" element={<MyAttendance />} />
            <Route path="/admin/tasks" element={<TaskList />} />
            
          </Route>
        </Route>

        {/* Employee-Only Routes */}
        <Route element={<EmployeeOnly />}>
          <Route element={<EmployeeLayout />}>
            <Route path="/dashboard" element={<EmployeeDashboard />} />
            <Route path="/leave/apply" element={<ApplyLeave />} />
            <Route path="/leave/my" element={<LeaveList />} />
            <Route path="/attendance" element={<MarkAttendance />} />
            <Route path="/attendance/view" element={<MyAttendance />} />
            <Route path="/tasks" element={<TaskList />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
