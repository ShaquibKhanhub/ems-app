import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaSignOutAlt,
  FaCalendarCheck,
  FaTasks,
  FaFileAlt,
  FaEnvelopeOpenText,
} from "react-icons/fa";

const Sidebar = ({ onLogout, open, setOpen, role = "Admin" }) => {
  const toggleSidebar = () => setOpen(!open);

  const links =
    role === "Admin"
      ? [
          {
            to: "/admin/dashboard",
            label: "Dashboard",
            icon: <FaTachometerAlt />,
          },
          { to: "/admin/employees", label: "Employees", icon: <FaUsers /> },
          {
            to: "/admin/departments",
            label: "Departments",
            icon: <FaBuilding />,
          },
          {
            to: "/admin/leaves",
            label: "Leave Requests",
            icon: <FaEnvelopeOpenText />,
          },
          {
            to: "/admin/tasks/create",
            label: "Assign Task",
            icon: <FaTasks />,
          },
          { to: "/admin/reports", label: "Reports", icon: <FaFileAlt /> },
          {
            to: "/admin/attendance",
            label: "Attendance",
            icon: <FaCalendarCheck />,
          },
        ]
      : [
          { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
          { to: "/tasks", label: "My Tasks", icon: <FaTasks /> },
          { to: "/attendance", label: "Attendance", icon: <FaCalendarCheck /> },
          {
            to: "/leave/apply",
            label: "Leave Requests",
            icon: <FaEnvelopeOpenText />,
          },
        ];

  const title = role === "Admin" ? "Admin Panel" : "Employee Panel";

  return (
    <div
      className={`bg-white text-black h-screen fixed flex flex-col ${
        open ? "w-64" : "w-16"
      } transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4">
        {open && <h2 className="text-xl font-bold">{title}</h2>}
        <button
          className="text-black flex justify-center "
          onClick={toggleSidebar}
        >
          ☰
        </button>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {links.map(({ to, label, icon }) => (
          <NavItem key={to} to={to} label={label} icon={icon} open={open} />
        ))}
      </nav>

      <div className="p-4 mt-auto flex justify-center">
        <button
          onClick={onLogout}
          className={`flex items-center justify-center ${
            open ? "justify-start px-4" : ""
          } w-full text-black bg-white py-2 rounded hover:bg-gray-200 transition`}
          title="Logout"
        >
          <FaSignOutAlt className="text-lg" />
          {open && <span className="ml-2">Logout</span>}
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ to, label, icon, open }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `group relative flex items-center justify-${
        open ? "start" : "center"
      } gap-2 py-2 px-4 rounded transition
      ${
        isActive
          ? "bg-gray-200 text-[#333] font-semibold border-l-4 border-slate-800"
          : "hover:bg-gray-100 text-black border-l-4 border-transparent hover:border-gray-300"
      }`
    }
  >
    <span className="text-lg">{icon}</span>
    {open && <span>{label}</span>}
    {!open && (
      <span className="absolute left-full ml-2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
    )}
  </NavLink>
);

export default Sidebar;
