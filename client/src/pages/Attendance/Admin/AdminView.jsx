// import { useEffect, useState } from "react";
// import instance from "../../../services/axios"; // your axios setup
// import { toast } from "react-toastify";
// import { SlRefresh } from "react-icons/sl";

// const AdminAttendance = () => {
//   const [attendance, setAttendance] = useState([]);
//   const [date, setDate] = useState("");

//   const fetchAttendance = async () => {
//     try {
//       const res = await instance.get("/attendance", {
//         params: date ? { date } : {},
//       });
//       setAttendance(res.data);
//     } catch (err) {
//       toast.error("Failed to fetch attendance");
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//   }, [date]);

//   return (
//     <div className="p-6 text-white space-y-6">
//       <h2 className="text-2xl font-semibold text-neutral-100">
//         All Attendance Records
//       </h2>

//       {/* Filters */}
//       <div className="flex gap-4 items-center mb-4">
//         <input
//           type="date"
//           className="p-2 bg-[#1a1a1a] border border-neutral-700 rounded text-white"
//           onChange={(e) => setDate(e.target.value)}
//         />
//         <button
//           onClick={fetchAttendance}
//           className="px-4 py-2 bg-white text-black rounded hover:bg-gray-100 transition border "
//         >
//             <SlRefresh className="inline mr-2 " />
//           Refresh
//         </button>
//       </div>

//       {/* Attendance Table */}
//       <div className="overflow-x-auto rounded border border-neutral-800 bg-[#111]">
//         <table className="min-w-full text-sm text-left">
//           <thead className="bg-[#0d0d0d] text-neutral-400">
//             <tr>
//               <th className="p-3">Employee</th>
//               <th className="p-3">Date</th>
//               <th className="p-3">Clock In</th>
//               <th className="p-3">Clock Out</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendance.length > 0 ? (
//               attendance.map((att) => (
//                 <tr
//                   key={att._id}
//                   className="border-t border-neutral-800 hover:bg-neutral-900"
//                 >
//                   <td className="p-3">{att.employeeId?.fullName || "N/A"}</td>
//                   <td className="p-3">
//                     {new Date(att.date).toLocaleDateString()}
//                   </td>
//                   <td className="p-3">
//                     {att.clockIn
//                       ? new Date(att.clockIn).toLocaleTimeString()
//                       : "—"}
//                   </td>
//                   <td className="p-3">
//                     {att.clockOut
//                       ? new Date(att.clockOut).toLocaleTimeString()
//                       : "—"}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={4} className="text-center py-6 text-neutral-500">
//                   No records found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminAttendance;
// pages/admin/attendance/AdminAttendanceTable.jsx

import React, { useEffect, useState } from "react";
import moment from "moment";
import instance from "../../../services/axios"; // Your axios setup
import { toast } from "react-toastify";

const AdminAttendanceTable = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment());

  const daysInMonth = Array.from(
    { length: currentMonth.daysInMonth() },
    (_, i) => i + 1
  );

  const fetchData = async () => {
    try {
      const { data } = await instance.get("/attendance");
      setAttendanceData(data);
    } catch (err) {
      toast.error("Failed to fetch attendance");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatus = (employeeId, day) => {
    const date = currentMonth.date(day).startOf("day").toISOString();
    const record = attendanceData.find(
      (a) =>
        a.employeeId?._id === employeeId && moment(a.date).isSame(date, "day")
    );
    return record ? "✅" : "❌";
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-semibold text-neutral-200 mb-4">
        Attendance - {currentMonth.format("MMMM YYYY")}
      </h2>

      <div className="overflow-x-auto border border-neutral-800 rounded-xl bg-[#111]">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-[#0d0d0d] text-neutral-400">
            <tr>
              <th className="px-4 py-2 text-left">Employee</th>
              <th className="px-4 py-2 text-left">Position</th>
              <th className="px-4 py-2">ID</th>
              {daysInMonth.map((day) => (
                <th key={day} className="px-2 py-2">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceData.length === 0 ? (
              <tr>
                <td colSpan={daysInMonth.length + 3} className="py-4">
                  No data found
                </td>
              </tr>
            ) : (
              Object.values(
                attendanceData.reduce((acc, curr) => {
                  const emp = curr.employeeId;
                  if (emp && emp._id) {
                    if (!acc[emp._id]) acc[emp._id] = emp;
                  }
                  return acc;
                }, {})
              ).map((emp) => (
                <tr key={emp._id} className="border-t border-neutral-800">
                  <td className="px-4 py-2 text-left">{emp.fullName}</td>
                  <td className="px-4 py-2 text-left">{emp.role || "N/A"}</td>
                  <td className="px-4 py-2">{emp._id.slice(-4)}</td>
                  {daysInMonth.map((day) => (
                    <td key={day} className="px-2 py-2">
                      {getStatus(emp._id, day)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAttendanceTable;
