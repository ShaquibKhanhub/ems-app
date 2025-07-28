import React from 'react'
import { useState } from 'react';

const EmployeeLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Or use `navigate("/login")`
  };
  return (
    <div className="flex">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onLogout={handleLogout}
        role="Employee"
      />

      <div
        className={`transition-all duration-300 min-h-screen bg-gray-100 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } w-full p-6`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default EmployeeLayout