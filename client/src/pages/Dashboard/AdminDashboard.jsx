import { useEffect, useState } from "react";
import {
  FaUsers,
  FaBuilding,
  FaTasks,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

import {
  fetchEmployeesCount,
  fetchDepartmentsCount,
  fetchTasksCount,
  fetchPendingLeavesCount,
  fetchTaskPerformance,
  fetchEmployeesByDepartment,
} from "../../services/adminDashboard";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    tasks: 0,
    pendingLeaves: 0,
  });

  const [barData, setBarData] = useState(null);
  const [pieData, setPieData] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [
          employees,
          departments,
          tasks,
          pendingLeaves,
          taskPerformance,
          employeesByDept,
        ] = await Promise.all([
          fetchEmployeesCount(),
          fetchDepartmentsCount(),
          fetchTasksCount(),
          fetchPendingLeavesCount(),
          fetchTaskPerformance(),
          fetchEmployeesByDepartment(),
        ]);
        console.log("Dashboard stats:", {
          employees,
          departments,
          tasks,
          pendingLeaves,
          taskPerformance,
          employeesByDept,
        });
        setStats({ employees, departments, tasks, pendingLeaves });
        console.log("👀 Set stats object:", {
          employees,
          departments,
          tasks,
          pendingLeaves,
        });

        // For bar chart (task completion)
        setBarData({
          labels: taskPerformance?.weeks || [
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
          ],
          datasets: [
            {
              label: "Tasks Completed",
              data: taskPerformance?.counts || [12, 19, 8, 15],
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          ],
        });

        // For pie chart (employees by department)
        setPieData({
          labels: employeesByDept?.labels || ["HR", "Tech", "Sales", "Support"],
          datasets: [
            {
              label: "Employees by Department",
              data: employeesByDept?.counts || [5, 10, 4, 5],
              backgroundColor: ["#000", "#444", "#888", "#ccc"],
            },
          ],
        });
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="text-black space-y-6 py-6">
      <h2 className="text-2xl font-bold">Welcome Admin</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<FaUsers />}
          label="Employees"
          count={stats.employees}
        />
        <StatCard
          icon={<FaBuilding />}
          label="Departments"
          count={stats.departments}
        />
        <StatCard icon={<FaTasks />} label="Tasks" count={stats.tasks} />
        <StatCard
          icon={<FaEnvelopeOpenText />}
          label="Pending Leaves"
          count={stats.pendingLeaves}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-4">Tasks Completed</h3>
          {barData ? <Bar data={barData} /> : <p>Loading chart...</p>}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-4">Employees by Department</h3>
          {pieData ? <Pie data={pieData} /> : <p>Loading chart...</p>}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, count }) => (
  <div className="bg-white p-4 rounded shadow flex items-center space-x-4">
    <div className="text-2xl text-black">{icon}</div>
    <div>
      <h4 className="text-lg font-semibold">{label}</h4>
      <p className="text-xl">{count}</p>
    </div>
  </div>
);

export default AdminDashboard;
