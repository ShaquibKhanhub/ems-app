import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected Layout */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Routes */}
        <Route element={<AdminOnly />}>
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/leaves" element={<LeaveRequests />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/attendance" element={<Attendance />} />
        </Route>

        {/* Employee Routes */}
        <Route element={<EmployeeOnly />}>
          <Route path="/my-leaves" element={<MyLeaves />} />
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/my-attendance" element={<MyAttendance />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};


export default AppRoutes;