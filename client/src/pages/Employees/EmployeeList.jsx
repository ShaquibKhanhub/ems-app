import { useEffect, useState } from "react";
import { fetchEmployees, deleteEmployee } from "../../services/employee";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchEmployees();
      setEmployees(data);
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    await deleteEmployee(id);
    setEmployees(employees.filter((emp) => emp._id !== id));
  };

  return (
    <div className="text-black space-y-4">
      <h2 className="text-xl font-bold">Employee List</h2>
      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Department</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id} className="border-t">
              <td className="p-3">{emp.username}</td>
              <td className="p-3">{emp.email}</td>
              <td className="p-3">{emp.role}</td>
              <td className="p-3">{emp.department || "N/A"}</td>
              <td className="p-3 flex gap-2 justify-center">
                <button className="text-blue-500">Edit</button>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(emp._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
