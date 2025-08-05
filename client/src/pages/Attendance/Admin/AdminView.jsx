import React, { useEffect, useState } from "react";
import instance from "../../../services/axios";
import AttendanceModal from "../../../../modals/Admin/AttendanceModal";

const AdminAttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedEmpId, setSelectedEmpId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const empRes = await instance.get("/employees");
      const deptRes = await instance.get("/departments");

      setEmployees(empRes.data);
      setDepartments(deptRes.data);
      setFiltered(empRes.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let data = employees;

    if (searchTerm)
      data = data.filter((emp) =>
        (emp.fullName + emp.email)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

    if (selectedDept !== "all")
      data = data.filter((emp) => emp.department?._id === selectedDept);

    setFiltered(data);
  }, [searchTerm, selectedDept, employees]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Employee Attendance</h2>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
        />
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/4 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full table-auto border rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Department</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((emp) => (
              <tr key={emp._id} className="border-t">
                <td className="px-4 py-2">{emp.fullName}</td>
                <td className="px-4 py-2">{emp.email}</td>
                <td className="px-4 py-2">{emp.department?.name || "N/A"}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelectedEmpId(emp._id)}
                    className="bg-white text-black px-3 py-1 rounded hover:bg-gray-100 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                  >
                    View Attendance
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-400">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedEmpId && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
          <AttendanceModal
            employeeId={selectedEmpId}
            onClose={() => setSelectedEmpId(null)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminAttendancePage;
