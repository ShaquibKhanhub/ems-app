import React, { useEffect, useState } from "react";
import instance from "../../../src/services/axios";

const AdminAssignTask = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignedTo, setAssignedTo] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const [commentText, setCommentText] = useState("");
  const [commentFile, setCommentFile] = useState(null);

  const fetchData = async () => {
    const empRes = await instance.get("/employees");
    const taskRes = await instance.get("/tasks");
    setEmployees(empRes.data);
    setTasks(taskRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!assignedTo || !title || !description) return alert("All fields required");

    await instance.post("/tasks", { assignedTo, title, description });
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setShowAssignModal(false);
    fetchData();
  };

  const handleStatusChange = async () => {
    if (!selectedTask || !newStatus) return;
    await instance.patch(`/tasks/${selectedTask._id}/status`, { status: newStatus });
    setSelectedTask(null);
    setNewStatus("");
    fetchData();
  };

  const handleCommentSubmit = async () => {
    if (!commentText) return;
    const formData = new FormData();
    formData.append("message", commentText);
    if (commentFile) formData.append("attachment", commentFile);

    await instance.post(`/tasks/${selectedTask._id}/comments`, {
      message: commentText,
      attachment: commentFile?.name || "",
    });

    setCommentText("");
    setCommentFile(null);
    setSelectedTask(null);
    fetchData();
  };

  const handleArchive = async (id) => {
    await instance.patch(`/tasks/${id}/archive`);
    fetchData();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <button
          onClick={() => setShowAssignModal(true)}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + Assign New Task
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Employee</th>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Assigned By</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border-t">
                <td className="p-2">{task.assignedTo?.fullName || "N/A"}</td>
                <td className="p-2">{task.title}</td>
                <td className="p-2">{task.status}</td>
                <td className="p-2">{task.assignedBy?.name || "Admin"}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleArchive(task._id)}
                    className="text-red-500 hover:underline"
                  >
                    Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Assign Task</h3>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.fullName}
                </option>
              ))}
            </select>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full border p-2 rounded mb-2"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-between gap-2">
              <button onClick={() => setShowAssignModal(false)} className="bg-gray-200 px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleAssign} className="bg-black text-white px-4 py-2 rounded">
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-md space-y-4">
            <h3 className="font-bold text-lg">Edit Task - {selectedTask.title}</h3>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add Comment"
              className="w-full border p-2 rounded"
            />
            <input type="file" onChange={(e) => setCommentFile(e.target.files[0])} />

            <div className="flex justify-between gap-2">
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setNewStatus("");
                  setCommentText("");
                  setCommentFile(null);
                }}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleStatusChange();
                  handleCommentSubmit();
                }}
                className="bg-black text-white px-4 py-2 rounded"
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

export default AdminAssignTask;
