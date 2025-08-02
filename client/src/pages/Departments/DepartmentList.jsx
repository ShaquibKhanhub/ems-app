import { useEffect, useState } from "react";
import {
  fetchDepartments,
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "../../services/department";
import { toast } from "react-toastify";
import { LuPlus } from "react-icons/lu";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteDept, setDeleteDept] = useState(null);

  const [editDept, setEditDept] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await fetchDepartments();
      setDepartments(data);
    };
    load();
  }, []);

  const handleAdd = async () => {
    if (!newDept.trim()) return;
    const created = await createDepartment({ name: newDept });
    setDepartments([...departments, created]);
    toast.success("Department added");
    setNewDept("");
    setShowAddModal(false);
  };

  const handleDelete = async (id) => {
    await deleteDepartment(id);
    setDepartments(departments.filter((d) => d._id !== id));
    toast.success("Department deleted");
  };
  const handleEditClick = (dept) => {
    setEditDept(dept);
    setEditName(dept.name);
  };

  const handleUpdate = async () => {
    try {
      await updateDepartment(editDept._id, { name: editName });
      toast.success("Department updated");

      // Refresh or update state
      const updated = departments.map((d) =>
        d._id === editDept._id ? { ...d, name: editName } : d
      );
      setDepartments(updated);

      setEditDept(null);
      setEditName("");
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };
  return (
    <div className="text-white space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Departments
        </h2>
        <button
          className="flex items-center gap-2 bg-[#1f1f1f] text-white px-4 py-2 rounded-full hover:bg-[#2a2a2a] transition"
          onClick={() => setShowAddModal(true)}
        >
          <LuPlus size={18} />
          Create
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-700 bg-[#0f0f0f] rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-[#1f1f1f] text-left text-gray-300">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr
                key={dept._id}
                className="border-t border-gray-800 hover:bg-[#1a1a1a]"
              >
                <td className="p-4">{dept.name}</td>
                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={() => handleEditClick(dept)}
                    className="px-3 py-1 bg-white text-black rounded hover:bg-gray-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteDept(dept)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-xl border border-neutral-800 shadow-xl w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Add Department
            </h2>
            <input
              className="w-full p-3 mb-4 bg-[#1a1a1a] text-white rounded-md border border-neutral-700 placeholder-neutral-500 focus:outline-none"
              placeholder="Department Name"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-white text-black rounded hover:bg-neutral-200 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {editDept && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-xl border border-neutral-800 shadow-xl w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Edit Department
            </h2>
            <input
              className="w-full p-3 mb-4 bg-[#1a1a1a] text-white rounded-md border border-neutral-700 placeholder-neutral-500 focus:outline-none"
              placeholder="Department Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditDept(null)}
                className="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-white text-black rounded hover:bg-neutral-200 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteDept && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-xl border border-neutral-800 shadow-xl w-[90%] max-w-sm text-white">
            <h2 className="text-lg font-semibold mb-4">Delete Department</h2>
            <p className="mb-4 text-sm text-gray-300">
              Are you sure you want to delete{" "}
              <span className="font-bold">{deleteDept.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteDept(null)}
                className="px-4 py-2 bg-neutral-800 rounded hover:bg-neutral-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDelete(deleteDept._id);
                  setDeleteDept(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
