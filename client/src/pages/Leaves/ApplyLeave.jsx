import { useState } from "react";
import instance from "../../services/axios";
import { toast } from "react-toastify";

const ApplyLeave = ({ employeeId }) => {
  const [form, setForm] = useState({
    leaveType: "",
    reason: "",
    fromDate: "",
    endDate: "",
  });

  const handleSubmit = async () => {
    try {
      const res = await instance.post("/leaves", {
        ...form,
        employeeId, // 👈 Make sure to pass this
      });
      
      toast.success("Leave request submitted");
      setForm({ leaveType: "", reason: "", fromDate: "", endDate: "" });

    } catch (err) {

      toast.error("Failed to apply leave");
      console.error("Leave application error:", err);
    }
  };

  return (
    <div className="bg-[#111] text-white p-6 rounded-xl w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>

      <select
        className="w-full p-3 bg-[#1a1a1a] mb-4 border border-neutral-700 rounded"
        value={form.leaveType}
        onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
      >
        <option value="">Select Leave Type</option>
        <option value="Sick">Sick Leave</option>
        <option value="Casual">Casual Leave</option>
        <option value="Paid">Paid Leave</option>
      </select>

      <input
        type="text"
        placeholder="Reason"
        className="w-full p-3 mb-4 bg-[#1a1a1a] border border-neutral-700 rounded"
        value={form.reason}
        onChange={(e) => setForm({ ...form, reason: e.target.value })}
      />

      <input
        type="date"
        className="w-full p-3 mb-4 bg-[#1a1a1a] border border-neutral-700 rounded"
        value={form.fromDate}
        onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
      />
      <input
        type="date"
        className="w-full p-3 mb-4 bg-[#1a1a1a] border border-neutral-700 rounded"
        value={form.endDate}
        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-white text-black rounded hover:bg-neutral-200"
      >
        Submit
      </button>
    </div>
  );
};

export default ApplyLeave;
