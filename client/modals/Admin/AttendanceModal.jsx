import React, { useEffect, useMemo, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  addMonths,
  subMonths,
  format,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { BsCalendarCheck, BsCalendarX, BsCalendarMinus } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import instance from "../../src/services/axios";

const AttendanceModal = ({ employeeId, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendance, setAttendance] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      const res = await instance.get(`/attendance/calendar/${employeeId}`);
      const data = {};
      res.data.forEach((entry) => {
        const key = format(new Date(entry.date), "yyyy-MM-dd");
        data[key] = {
          status:
            entry.clockIn && entry.clockOut
              ? "present"
              : entry.clockIn && !entry.clockOut
              ? "partial"
              : "absent",
          clockIn: entry.clockIn,
          clockOut: entry.clockOut,
          full: entry,
        };
      });
      setAttendance(data);
    };
    fetchAttendance();
  }, [employeeId, currentDate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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

  const handlePrint = () => {
    const printContent = document.getElementById("attendance-print");
    const printWindow = window.open("", "", "width=900,height=600");
    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head><title>Attendance</title><style>
          body{font-family:sans-serif;padding:20px}
          .grid{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}
          .cell{padding:6px;border-radius:6px;text-align:center}
          </style></head>
          <body>${printContent.innerHTML}</body>
        </html>`);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleExportCSV = () => {
    let csv = "Date,Status,Clock In,Clock Out\n";
    Object.keys(attendance).forEach((date) => {
      const att = attendance[date];
      csv += `${date},${att.status},${att.clockIn || ""},${
        att.clockOut || ""
      }\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${format(currentDate, "yyyy_MM")}.csv`;
    a.click();
  };

  const statusCounts = Object.values(attendance).reduce(
    (acc, val) => {
      acc[val.status] = (acc[val.status] || 0) + 1;
      return acc;
    },
    { present: 0, absent: 0, partial: 0 }
  );

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-lg p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-1  text-gray-600 hover:text-black text-xl px-2"
        >
          ✕
        </button>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            Attendance - {format(currentDate, "MMMM yyyy")}
          </h3>
          <div className="flex gap-2">
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

        {/* Calendar */}
        <div id="attendance-print">
          <div className="grid grid-cols-7 text-center font-semibold text-gray-500 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const dayData = attendance[key];
              const status =
                dayData?.status ||
                (day.getDay() === 0 || day.getDay() === 6
                  ? "weekend"
                  : "absent");

              return (
                <div
                  key={key}
                  className={`p-2 rounded-md text-center relative cursor-pointer ${getStatusColor(
                    status
                  )} ${isToday(day) ? "ring-2 ring-blue-400" : ""}`}
                  onClick={() => {
                    if (dayData) setSelectedDay({ date: key, ...dayData });
                  }}
                  title={
                    dayData?.clockIn || dayData?.clockOut
                      ? `In: ${dayData.clockIn || "-"} | Out: ${
                          dayData.clockOut || "-"
                        }`
                      : "No data"
                  }
                >
                  <div className="text-sm">{format(day, "d")}</div>
                  {getStatusIcon(status)}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-4 text-sm">
            <span className="text-green-700">
              Present: {statusCounts.present}
            </span>
            <span className="text-yellow-700">
              Partial: {statusCounts.partial}
            </span>
            <span className="text-red-700">Absent: {statusCounts.absent}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
            >
              Print / Save as PDF
            </button>
            <button
              onClick={handleExportCSV}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Day Detail Modal */}
        {selectedDay && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h4 className="text-lg font-semibold mb-4">
                Details - {selectedDay.date}
              </h4>
              <p>
                <strong>Status:</strong> {selectedDay.status}
              </p>
              <p>
                <strong>Clock In:</strong> {selectedDay.clockIn || "N/A"}
              </p>
              <p>
                <strong>Clock Out:</strong> {selectedDay.clockOut || "N/A"}
              </p>
              <button
                onClick={() => setSelectedDay(null)}
                className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceModal;
