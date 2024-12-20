import React, { useState } from "react";
import { FiHome, FiMenu, FiFileText, FiCalendar, FiTrash, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {/* Hamburger Button for Mobile Screens */}
      <button
        className="lg:hidden p-2 absolute top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        <FiMenu />
      </button>

      {/* Sidebar */}
      <nav
        className={`bg-gray-100 text-black w-64 p-4 fixed inset-0 transform transition-all duration-300 ease-in-out z-50 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 lg:h-full`}
      >
        {/* Close Button for Sidebar */}
        <button
          className="lg:hidden p-2 absolute top-4 right-4 z-50"
          onClick={toggleSidebar}
        >
          <FiX />
        </button>

        {/* Links Section */}
        <ul className="space-y-4">
          {/* Dashboard Link */}
          {/* <li className="hover:bg-gray-100 p-2 rounded">
            <NavLink
              to="/dashboard"
              className="flex items-center space-x-2"
              activeClassName="bg-[#FABD05] bg-opacity-30 text-white"
            >
              <FiHome />
              <span>Dashboard</span>
            </NavLink>
          </li> */}

          {/* Notes Link */}
          <li className="hover:bg-gray-100 p-2 rounded">
            <NavLink
              to="/notes"
              className="flex items-center space-x-2"
              activeClassName="bg-[#FABD05] bg-opacity-30 text-white"
            >
              <FiFileText />
              <span>Notes</span>
            </NavLink>
          </li>

          {/* Meetings Link */}
          <li className="hover:bg-gray-100 p-2 rounded">
            <NavLink
              to="/meetings"
              className="flex items-center space-x-2"
              activeClassName="bg-[#FABD05] bg-opacity-30 text-white"
            >
              <FiCalendar />
              <span>Meetings</span>
            </NavLink>
          </li>

          {/* Bin Link */}
          <li className="hover:bg-gray-100 p-2 rounded">
            <NavLink
              to="/bin"
              className="flex items-center space-x-2"
              activeClassName="bg-[#FABD05] bg-opacity-30 text-white"
            >
              <FiTrash />
              <span>Bin</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
