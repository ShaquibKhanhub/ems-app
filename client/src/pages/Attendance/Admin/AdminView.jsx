import React, { useEffect, useState, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  format,
  startOfWeek,
  endOfWeek,
} from "date-fns";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsCalendarCheck, BsCalendarX, BsCalendarMinus } from "react-icons/bs";
import instance from "../../../services/axios"; // your axios instance

const AdminAttendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [attendance, setAttendance] = useState({});

  // Fetch employee list
  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await instance.get("/employees");
      setEmployees(res.data);
      if (res.data[0]) setSelectedEmpId(res.data[0]._id);
    };
    fetchEmployees();
  }, []);

  // Fetch attendance for selected employee
  useEffect(() => {
    if (!selectedEmpId) return;
    const fetchAttendance = async () => {
      const res = await instance.get(`/attendance/calendar/${selectedEmpId}`);
      const data = {};
      res.data.forEach((entry) => {
        const key = format(new Date(entry.date), "yyyy-MM-dd");
        if (entry.clockIn && entry.clockOut) data[key] = "present";
        else if (entry.clockIn && !entry.clockOut) data[key] = "partial";
        else data[key] = "absent";
      });
      setAttendance(data);
    };
    fetchAttendance();
  }, [selectedEmpId, currentDate]);

  const calendarDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 }),
      end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 }),
    });
  }, [currentDate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "weekend":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <BsCalendarCheck className="w-4 h-4" />;
      case "absent":
        return <BsCalendarX className="w-4 h-4" />;
      case "partial":
        return <BsCalendarMinus className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Attendance - {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.fullName}
              </option>
            ))}
          </select>
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center font-semibold text-gray-500 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const status =
            attendance[key] ||
            (day.getDay() === 0 || day.getDay() === 6 ? "weekend" : "absent");

          return (
            <div
              key={key}
              className={`p-2 rounded-md text-center ${getStatusColor(
                status
              )} ${isToday(day) ? "ring-2 ring-blue-400" : ""}`}
            >
              <div className="text-sm">{format(day, "d")}</div>
              {getStatusIcon(status)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminAttendance;
