import { useEffect, useState } from "react";
import instance from "../../services/axios";
import { toast } from "react-toastify";

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("fullName"); // default to full name
  const [statusFilter, setStatusFilter] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState(null);

  const fetchLeaves = async () => {
    try {
      const { data } = await instance.get("/leaves");
      setLeaves(data);
    } catch (err) {
      toast.error("Failed to load leave requests");
    }
  };
  const filteredLeaves = leaves.filter((leave) => {
    const term = searchTerm.toLowerCase();
    const name = leave.employeeId?.fullName?.toLowerCase() || "";
    const email = leave.employeeId?.email?.toLowerCase() || "";

    const matchesSearch =
      searchBy === "fullName" ? name.includes(term) : email.includes(term);

    const statusMatch = statusFilter ? leave.status === statusFilter : true;
    const typeMatch = leaveTypeFilter
      ? leave.leaveType === leaveTypeFilter
      : true;

    return matchesSearch && statusMatch && typeMatch;
  });

  const updateLeaveStatus = async (id, action) => {
    try {
      const { data } = await instance.patch(`/leaves/${id}/${action}`);
      setLeaves((prev) =>
        prev.map((leave) => (leave._id === id ? data : leave))
      );
      toast.success(`Leave ${action}d successfully`);
    } catch (err) {
      toast.error(`Failed to ${action} leave`);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  console.log("Leave requests:", leaves);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("dropdown");
      const button = document.getElementById("dropdownDefaultButton");
      if (
        dropdown &&
        !dropdown.contains(event.target) &&
        !button.contains(event.target)
      ) {
        dropdown.classList.add("hidden");
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-6 text-white space-y-4">
      <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
        Leave Requests
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
        {/* 🔍 Search */}
        <div className="w-full max-w-sm min-w-[200px]">
          <div className="relative mt-2">
            <div className="absolute top-1 left-1 flex items-center">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("dropdownMenu")
                    .classList.toggle("hidden")
                }
                className="rounded border border-transparent py-1 px-1.5 text-center flex items-center text-sm transition-all text-slate-600"
              >
                <span
                  id="dropdownSpan"
                  className="text-ellipsis overflow-hidden capitalize"
                >
                  {searchBy === "email" ? "Email" : "Full Name"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4 ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              <div className="h-6 border-l border-slate-200 ml-1"></div>
              <div
                id="dropdownMenu"
                className="min-w-[150px] absolute left-0 w-full mt-10 hidden bg-white border border-slate-200 rounded-md shadow-lg z-10"
              >
                <ul>
                  <li
                    onClick={() => {
                      setSearchBy("fullName");
                      document
                        .getElementById("dropdownMenu")
                        .classList.add("hidden");
                    }}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-50 text-sm cursor-pointer"
                  >
                    Full Name
                  </li>
                  <li
                    onClick={() => {
                      setSearchBy("email");
                      document
                        .getElementById("dropdownMenu")
                        .classList.add("hidden");
                    }}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-50 text-sm cursor-pointer"
                  >
                    Email
                  </li>
                </ul>
              </div>
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder={`Search by ${searchBy}`}
            />

            {/* <button
              type="button"
              className="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 mr-1.5"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
              Search
            </button> */}
          </div>
        </div>

        {/* 🗂️ Filter by Status */}
        <div className="relative inline-block text-left">
          <button
            id="statusDropdownBtn"
            onClick={() =>
              document
                .getElementById("statusDropdownMenu")
                .classList.toggle("hidden")
            }
            type="button"
            className="text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600 border"
          >
            {statusFilter || "All Statuses"}
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1L5 5L9 1"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div
            id="statusDropdownMenu"
            className="z-10 hidden absolute mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 border "
          >
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {["All", "Pending", "Approved", "Rejected"].map((status) => (
                <li key={status}>
                  <button
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-black ${
                      (status === "All" && statusFilter === "") ||
                      statusFilter === status
                        ? "font-semibold"
                        : ""
                    }`}
                    onClick={() => {
                      setStatusFilter(status === "All" ? "" : status);
                      document
                        .getElementById("statusDropdownMenu")
                        .classList.add("hidden");
                    }}
                  >
                    {status}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 📅 Filter by Leave Type */}

        <div className="relative inline-block text-left">
          <button
            id="leaveTypeDropdownButton"
            onClick={() =>
              document
                .getElementById("leaveTypeDropdownMenu")
                .classList.toggle("hidden")
            }
            type="button"
            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-2 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 3"
            >
              <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div
            id="leaveTypeDropdownMenu"
            className="hidden absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none "
          >
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {["All", "Medical", "Casual", "Personal"].map((type) => (
                <li key={type}>
                  <button
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${
                      (type === "All" && leaveTypeFilter === "") ||
                      leaveTypeFilter === type
                        ? "font-semibold"
                        : ""
                    }`}
                    onClick={() => {
                      setLeaveTypeFilter(type === "All" ? "" : type);
                      document
                        .getElementById("leaveTypeDropdownMenu")
                        .classList.add("hidden");
                    }}
                  >
                    {type}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-[#111]">
        <table className="min-w-full text-sm">
          <thead className="bg-[#0d0d0d] text-neutral-400">
            <tr>
              <th className="px-4 py-3 text-left">Employee</th>
              <th className="px-4 py-3 text-left">Leave Type</th>
              <th className="px-4 py-3 text-left">Reason</th>
              <th className="px-4 py-3 text-left">From</th>
              <th className="px-4 py-3 text-left">To</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map((leave) => (
              <tr
                key={leave._id}
                className="border-t border-neutral-800 hover:bg-neutral-900"
              >
                <td className="px-4 py-3">
                  {leave.employeeId?.fullName || "N/A"}
                </td>
                <td className="px-4 py-3">{leave.leaveType}</td>
                <td className="px-4 py-3">{leave.reason}</td>
                <td className="px-4 py-3">
                  {new Date(leave.fromDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">{leave.status}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    disabled={leave.status === "Approved"}
                    onClick={() => updateLeaveStatus(leave._id, "approve")}
                    className="bg-white text-black px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    disabled={leave.status === "Rejected"}
                    onClick={() => updateLeaveStatus(leave._id, "reject")}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {leaves.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-neutral-500">
                  No leave requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequests;
