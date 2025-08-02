import { useEffect, useState } from "react";
import instance from "../../services/axios";

const LeaveList = ({ employeeId }) => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await instance.get(`/leaves/${employeeId}`);
      setLeaves(data);
    };
    load();
  }, [employeeId]);

  return (
    <div className="text-white p-6">
      <h2 className="text-2xl font-bold mb-4">My Leave Requests</h2>
      <table className="min-w-full text-sm bg-[#111] border border-neutral-800">
        <thead className="bg-[#0d0d0d] text-neutral-400">
          <tr>
            <th className="p-4">Type</th>
            <th className="p-4">Reason</th>
            <th className="p-4">From</th>
            <th className="p-4">To</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr
              key={leave._id}
              className="border-t border-neutral-800 hover:bg-neutral-900"
            >
              <td className="p-4">{leave.leaveType}</td>
              <td className="p-4">{leave.reason}</td>
              <td className="p-4">
                {new Date(leave.fromDate).toLocaleDateString()}
              </td>
              <td className="p-4">
                {new Date(leave.endDate).toLocaleDateString()}
              </td>
              <td className="p-4">{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveList;
