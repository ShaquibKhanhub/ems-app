import React, { useState } from "react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const user = localStorage.getItem("employee");
  const userData = user ? JSON.parse(user) : null;

  console.log("user", user);
  console.log("Image:", userData?.imageUrl);
  console.log("Gender:", userData?.employeeId?.gender);

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center space-x-3">
          <img
            src="/ems-logo5.png"
            className="h-8"
            alt="Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            EMS
          </span>
        </a>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src={
                userData?.imageUrl
                  ? userData.imageUrl
                  : userData.gender === "male"
                  ? "https://flowbite.com/docs/images/people/profile-picture-4.jpg"
                  : "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              }
              alt="user photo"
            />
          </button>

          {isDropdownOpen && (
            <div className="z-50 absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {userData?.fullName || "User Name"}
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  {userData?.username}
                </span>
              </div>
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => {
                      localStorage.removeItem("employee");
                      window.location.href = "/login"; 
                    }}
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
