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
import { fetchDepartments } from "../../services/department";

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
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await fetchDepartments();
      setDepartments(data);
    };
    loadDepartments();
  }, []);

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
        // Delete both user and employee
        await Promise.all([
          deleteUser(deleteId.userId._id),
          deleteEmployee(deleteId._id),
        ]);
        toast.success("User and employee deleted successfully");
      } else {
        // Unregistered employee → delete employee only
        await deleteEmployee(deleteId._id);
        toast.success("Employee deleted successfully");
      }

      // Update state
      setEmployees((prev) => prev.filter((emp) => emp._id !== deleteId._id));
    } catch (err) {
      toast.error("Failed to delete");
      console.error("Delete error:", err);
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
      department: emp.department || "",
      role: emp.userId?.role || "",
    });
  };

  const handleEditSave = async () => {
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);

      if (formData.department) {
        formDataToSend.append("department", formData.department);
      }

      if (formData.photo instanceof File) {
        formDataToSend.append("photo", formData.photo);
      }

      if (formData.documents?.length) {
        for (let doc of formData.documents) {
          if (doc instanceof File) {
            formDataToSend.append("documents", doc);
          }
        }
      }

      // 🔄 First: Update employee data
      await instance.patch(`/employees/${editData._id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ Then: Update role only if user is registered and role is selected
      if (editData.userId && formData.role) {
        await instance.patch("/admin/set-role", {
          userId: editData.userId,
          role: formData.role,
        });
      }

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
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white text-black p-6 rounded-xl shadow-2xl w-[90%] max-w-md space-y-4 border border-neutral-200">
      <h2 className="text-xl font-semibold">Create Employee</h2>

      <input
        type="email"
        placeholder="Email *"
        className="w-full p-3 rounded border border-neutral-300 placeholder:text-neutral-500"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Full Name"
        className="w-full p-3 rounded border border-neutral-300 placeholder:text-neutral-500"
        value={formData.fullName}
        onChange={(e) =>
          setFormData({ ...formData, fullName: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Phone"
        className="w-full p-3 rounded border border-neutral-300 placeholder:text-neutral-500"
        value={formData.phone}
        onChange={(e) =>
          setFormData({ ...formData, phone: e.target.value })
        }
      />

      <input
        type="file"
        accept="image/*"
        className="w-full text-sm text-neutral-700"
        onChange={(e) =>
          setFormData({ ...formData, photo: e.target.files[0] })
        }
      />

      <select
        value={formData.department || ""}
        onChange={(e) =>
          setFormData({ ...formData, department: e.target.value })
        }
        className="w-full p-3 rounded border border-neutral-300 text-black"
      >
        <option value="">Select Department</option>
        {departments.map((dept) => (
          <option key={dept._id} value={dept._id}>
            {dept.name}
          </option>
        ))}
      </select>

      <div className="flex justify-end gap-3 pt-2">
        <button
          className="px-4 py-2 rounded border border-neutral-300 bg-white hover:bg-neutral-100 transition"
          onClick={() => setShowCreateModal(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded bg-black text-white hover:bg-neutral-800 transition"
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
                    src={emp.imageUrl || avatar}
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
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative text-center shadow-xl">
            {/* Close Button */}
            <button
              onClick={() => setDeleteId(null)}
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
              <span className="font-semibold">{deleteId?.fullName}</span>?
            </h2>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleDelete}
                disabled={!deleteId?._id}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md"
              >
                Yes, I'm sure
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-md"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
    {editData && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white text-black p-6 rounded-xl border border-neutral-300 shadow-2xl w-[90%] max-w-md space-y-4">
      <h2 className="text-xl font-semibold">Edit Employee</h2>

      <input
        type="text"
        placeholder="Full Name"
        className="w-full p-3 bg-white rounded border border-neutral-300"
        value={formData.fullName}
        onChange={(e) =>
          setFormData({ ...formData, fullName: e.target.value })
        }
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 bg-white rounded border border-neutral-300"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Phone"
        className="w-full p-3 bg-white rounded border border-neutral-300"
        value={formData.phone}
        onChange={(e) =>
          setFormData({ ...formData, phone: e.target.value })
        }
      />

      <select
        value={formData.department || ""}
        onChange={(e) =>
          setFormData({ ...formData, department: e.target.value })
        }
        className="w-full p-3 bg-white rounded border border-neutral-300"
      >
        <option value="">Select Department</option>
        {departments.map((dept) => (
          <option key={dept._id} value={dept._id}>
            {dept.name}
          </option>
        ))}
      </select>

      <select
        className="w-full p-3 bg-white rounded border border-neutral-300"
        value={formData.role || ""}
        onChange={(e) =>
          setFormData({ ...formData, role: e.target.value })
        }
        disabled={!editData?.userId}
      >
        <option value="" disabled>
          Select Role
        </option>
        <option value="Admin">Admin</option>
        <option value="Employee">Employee</option>
      </select>

      <div className="flex justify-end gap-3 pt-2">
        <button
          className="px-4 py-2 rounded border border-neutral-300 bg-white hover:bg-neutral-100"
          onClick={() => setEditData(null)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded bg-black text-white hover:bg-neutral-800"
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
