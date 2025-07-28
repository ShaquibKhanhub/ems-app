import React from "react";

const EmployeeOnly = () => {
  const user = JSON.parse(localStorage.getItem("employee"));

  if (!user || user.role !== "Employee") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default EmployeeOnly;
