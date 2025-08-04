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
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xl w-[90%] max-w-sm">
      <h2 className="text-lg font-semibold mb-4 text-black">Add Department</h2>
      <input
        className="w-full p-3 mb-4 bg-gray-100 text-black rounded-md border border-gray-300 placeholder-gray-500 focus:outline-none"
        placeholder="Department Name"
        value={newDept}
        onChange={(e) => setNewDept(e.target.value)}
      />
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowAddModal(false)}
          className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-black text-white rounded hover:bg-neutral-800 transition"
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
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xl w-[90%] max-w-sm">
      <h2 className="text-lg font-semibold mb-4 text-black">Edit Department</h2>
      <input
        className="w-full p-3 mb-4 bg-gray-100 text-black rounded-md border border-gray-300 placeholder-gray-500 focus:outline-none"
        placeholder="Department Name"
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
      />
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setEditDept(null)}
          className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-black text-white rounded hover:bg-neutral-800 transition"
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}

{/* Delete Department Modal */}
{/* Delete Modal (White Styled) */}
{deleteDept && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative text-center shadow-xl">
      {/* Close Button */}
      <button
        onClick={() => setDeleteDept(null)}
        className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-semibold"
      >
        &times;
      </button>

      {/* Icon */}
      <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full border-4 border-gray-300">
        <span className="text-3xl text-gray-500">!</span>
      </div>

      {/* Text */}
      <h2 className="text-gray-700 text-lg mb-4">
        Are you sure you want to delete{" "}
        <span className="font-semibold">{deleteDept?.name}</span>?
      </h2>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={async () => {
            await handleDelete(deleteDept._id);
            setDeleteDept(null);
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md"
        >
          Yes, I'm sure
        </button>
        <button
          onClick={() => setDeleteDept(null)}
          className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-md"
        >
          No, cancel
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default DepartmentList;
