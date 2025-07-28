import { Navigate, Outlet } from "react-router-dom";

const AdminOnly = () => {
  const user = JSON.parse(localStorage.getItem("employee"));

  if (!user || user.role !== "Admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminOnly;
