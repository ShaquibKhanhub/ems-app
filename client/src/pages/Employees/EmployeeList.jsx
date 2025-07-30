import { useEffect, useState } from "react";
import {
  fetchEmployees,
  deleteEmployee,
  updateEmployee,
} from "../../services/employee";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchEmployees();
      setEmployees(data);
    };
    load();
  }, []);

  const handleDelete = async () => {
    await deleteEmployee(deleteId);
    setEmployees(employees.filter((emp) => emp._id !== deleteId));
    setDeleteId(null);
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    const updated = await updateEmployee(editData._id, editData);
    setEmployees((prev) =>
      prev.map((emp) => (emp._id === updated._id ? updated : emp))
    );
    setEditData(null);
  };

  return (
    <div className="text-white space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-black">Employee List</h2>

      <div className="overflow-x-auto rounded shadow border border-gray-700 bg-black">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-900 text-gray-300 text-left">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Department</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp._id}
                className="border-t border-gray-800 hover:bg-gray-800"
              >
                <td className="p-4">{emp.fullName || "N/A"}</td>
                <td className="p-4">{emp.email}</td>
                <td className="p-4">{emp?.userId?.role || "N/A"}</td>
                <td className="p-4">{emp?.department?.name || "N/A"}</td>
                <td className="p-4 flex justify-center gap-3">
                  <button
                    onClick={() => setEditData(emp)}
                    className="px-3 py-1 bg-white text-black rounded hover:bg-gray-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(emp._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-md text-center text-white border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this employee?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#111] text-white p-6 rounded-xl border border-neutral-800 shadow-2xl w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Edit Employee</h2>

            <input
              className="w-full p-3 bg-[#1a1a1a] text-white rounded-md border border-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10"
              type="text"
              placeholder="Full Name"
              value={editData.fullName}
              onChange={(e) => handleEditChange("fullName", e.target.value)}
            />

            <input
              className="w-full p-3 bg-[#1a1a1a] text-white rounded-md border border-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10"
              type="email"
              placeholder="Email"
              value={editData.email}
              onChange={(e) => handleEditChange("email", e.target.value)}
            />

            <input
              className="w-full p-3 bg-[#1a1a1a] text-white rounded-md border border-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10"
              type="text"
              placeholder="Phone"
              value={editData.phone}
              onChange={(e) => handleEditChange("phone", e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                className="px-4 py-2 rounded-md border border-neutral-700 bg-[#1a1a1a] hover:bg-[#2a2a2a] transition"
                onClick={() => setEditData(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-white text-black hover:bg-neutral-200 transition"
                onClick={handleEditSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
