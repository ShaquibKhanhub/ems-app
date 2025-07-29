import instance from "../services/axios"; // Assuming you have an instance setup

// Get total employees
export const fetchEmployeesCount = async () => {
  const res = await instance.get("/employees");
  console.log("sdfsdf", res.data);
  return res.data.length; // adjust if API structure is different
};

// Get total departments
export const fetchDepartmentsCount = async () => {
  const res = await instance.get("/departments");
  return res.data.length;
};

// Get total tasks
export const fetchTasksCount = async () => {
  const res = await instance.get("/tasks"); // Admin only
  return res.data.length;
};

// Get pending leave count
export const fetchPendingLeavesCount = async () => {
  const res = await instance.get("/leaves");
  console.log("Pending leaves response:", res.data);
  const allLeaves = res.data;
  const pendingCount = allLeaves.filter(
    (leave) => leave.status === "Pending"
  ).length;
    console.log("Pending leaves count:", pendingCount);
  return pendingCount;
};

// Optional: get task data for bar chart
export const fetchTaskPerformance = async () => {
  const res = await instance.get("/reports/tasks");
  return res.data; // depends on your backend structure
};

// Optional: get employee by department data
export const fetchEmployeesByDepartment = async () => {
  const res = await instance.get("/reports/leaves"); // If this endpoint is for department stats
  return res.data;
};
