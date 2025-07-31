import { useEffect, useState } from "react";
import {
  deleteEmployee,
  fetchEmployees,
  updateEmployee,
} from "../../services/employee";
import { toast } from "react-toastify";
import avatar from "../../../public/simple-user-default-icon-free-png.webp";
import { LuPlus } from "react-icons/lu";
import { deleteUser } from "../../services/adminDashboard";
import instance from "../../services/axios";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    department: "",
    photo: null,
    documents: [],
  });

  useEffect(() => {
    const load = async () => {
      const data = await fetchEmployees();
      setEmployees(data);
    };
    load();
  }, []);

  const handleDelete = async () => {
    try {
      if (deleteId?.userId?._id) {
        // If userId is present, delete from /admin route (will delete both user + employee)
        await deleteUser(deleteId.userId._id); // ✅ Correct — but ensure the backend route also deletes employee by userId
        setEmployees((prev) => prev.filter((emp) => emp._id !== deleteId._id));
      } else {
        // If no userId, delete only the employee from /employees route
        await deleteEmployee(deleteId._id);
      }

      toast.success("Employee deleted successfully");

      // Update state
      setEmployees((prev) => prev.filter((emp) => emp._id !== deleteId._id));
    } catch (err) {
      toast.error("Failed to delete employee");
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  const handleEditClick = (emp) => {
    setEditData(emp);
    setFormData({
      fullName: emp.fullName || "",
      email: emp.email || "",
      phone: emp.phone || "",
    });
  };

  const handleEditSave = async () => {
    try {
      await updateEmployee(editData._id, formData);
      const updated = employees.map((emp) =>
        emp._id === editData._id ? { ...emp, ...formData } : emp
      );
      setEmployees(updated);
      toast.success("Employee updated successfully");
      setEditData(null);
    } catch (error) {
      toast.error("Failed to update employee");
      console.error(error);
    }
  };

  const handleCreateEmployee = async () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "documents" && value.length > 0) {
        value.forEach((file) => form.append("documents", file));
      } else if (key === "photo" && value) {
        form.append("photo", value);
      } else if (value) {
        form.append(key, value);
      }
    });

    console.log("formData values:", formData);

    try {
      const { data } = await instance.post("/employees/", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEmployees((prev) => [...prev, data.employee]);
      toast.success("Employee created");
      setShowCreateModal(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        address: "",
        department: "",
        photo: null,
        documents: [],
      });
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      toast.error("Failed to create employee");
    }
  };

  return (
    <div className="p-6 text-white space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-neutral-800">
          Employee List
        </h2>
        <button
          className="flex items-center gap-2 bg-[#1f1f1f] text-white px-4 py-2 rounded-full hover:bg-[#2a2a2a] transition"
          onClick={() => setShowCreateModal(true)}
        >
          <LuPlus size={18} />
          Create
        </button>

        {showCreateModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-[#111] p-6 rounded-xl border border-neutral-800 shadow-2xl w-[90%] max-w-md text-white space-y-4">
              <h2 className="text-xl font-semibold">Create Employee</h2>

              <input
                type="email"
                placeholder="Email *"
                className="w-full p-3 bg-[#1a1a1a] rounded border border-neutral-700"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 bg-[#1a1a1a] rounded border border-neutral-700"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Phone"
                className="w-full p-3 bg-[#1a1a1a] rounded border border-neutral-700"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, photo: e.target.files[0] })
                }
                className="w-full text-sm"
              />

              <input
                type="file"
                multiple
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documents: Array.from(e.target.files),
                  })
                }
                className="w-full text-sm"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  className="px-4 py-2 rounded border border-neutral-700 bg-[#1a1a1a] hover:bg-[#2a2a2a]"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-white text-black hover:bg-neutral-200"
                  onClick={handleCreateEmployee}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-[#111]">
        <table className="min-w-full text-sm">
          <thead className="bg-[#0d0d0d] text-neutral-400">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp._id}
                className="border-t border-neutral-800 hover:bg-neutral-900"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={emp.photo || avatar}
                    alt={emp.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {emp.fullName || "N/A"}
                </td>

                <td className="px-6 py-4">{emp.email}</td>
                <td className="px-6 py-4">{emp?.userId?.role || "N/A"}</td>
                <td className="px-6 py-4">{emp?.department?.name || "N/A"}</td>
                <td className="px-6 py-4 flex justify-center gap-3">
                  <button
                    onClick={() => handleEditClick(emp)}
                    className="px-3 py-1 bg-white text-black rounded hover:bg-neutral-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(emp)}
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

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-xl border border-neutral-800 shadow-xl w-[90%] max-w-sm text-white">
            <h2 className="text-lg font-semibold mb-3">Confirm Deletion</h2>
            <p className="text-sm text-neutral-400 mb-5">
              Are you sure you want to delete {deleteId?.fullName}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-neutral-800 rounded hover:bg-neutral-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId?.userId?._id)}
                disabled={!deleteId?.userId?._id}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-xl border border-neutral-800 shadow-2xl w-[90%] max-w-md text-white space-y-4">
            <h2 className="text-xl font-semibold">Edit Employee</h2>

            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 bg-[#1a1a1a] rounded border border-neutral-700"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-[#1a1a1a] rounded border border-neutral-700"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone"
              className="w-full p-3 bg-[#1a1a1a] rounded border border-neutral-700"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                className="px-4 py-2 rounded border border-neutral-700 bg-[#1a1a1a] hover:bg-[#2a2a2a]"
                onClick={() => setEditData(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-white text-black hover:bg-neutral-200"
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
