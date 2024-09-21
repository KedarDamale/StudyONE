import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaRobot,
  FaDesktop,  // Changed from FaComputer to FaDesktop
  FaQuestionCircle
} from "react-icons/fa";
import { AiFillHome, AiOutlineClose } from "react-icons/ai";
import { IoLibrary } from "react-icons/io5";
import { ImPencil2 } from "react-icons/im";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { MdAccessAlarms } from "react-icons/md";
import Logo123 from "../assets/Logo123.png"; 
import { useAuthStore } from "../store/authStore";

const SidebarData = [
  {
    title: "Home",
    path: "/dashboard",
    icon: <AiFillHome />,
  },
  {
    title: "My Library",
    path: "/MyLibrary",
    icon: <IoLibrary />,
  },
  {
    title: "Whiteboard",
    path: "/products",
    icon: <ImPencil2 />,
  },
  {
    title: "Lecture 2 Notes AI",
    path: "/team",
    icon: <FaRobot />,
  },
  {
    title: "Interview Hub",
    path: "/messages",
    icon: <FaDesktop />,  // Updated to FaDesktop
  },
  {
    title: "Expense Tracker",
    path: "/support",
    icon: <RiMoneyRupeeCircleLine />,
  },
  {
    title: "Alarms & Trackers",
    path: "/about",
    icon: <MdAccessAlarms />,
  }
];

const ExtraMenuData = [
  {
    title: "Help",
    icon: <FaQuestionCircle />,
    action: (navigate) => navigate('/gethelp')
  },
  {
    title: "Sign Out",
    icon: <FaSignOutAlt />,
    action: async (logout) => {
      try {
        await logout();
      } catch (error) {
        console.error("Error logging out:", error);
      }
    },
  },
];

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const { logout } = useAuthStore((state) => ({
    logout: state.logout,
  }));

  const handleAction = async (action) => {
    if (typeof action === "function") {
      // Check if the action function is a logout action
      if (action.length === 1) {
        await action(navigate); // Action only needs navigate
      } else {
        await action(logout); // Action needs only logout
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 h-full w-60 bg-black transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} z-50 shadow-lg`}
    >
      <div className="flex items-center px-4 bg-black h-16">
        <button
          className="text-2xl text-white mr-4 hover:text-emerald-300"
          onClick={toggleSidebar}
          aria-label="Close Sidebar"
        >
          <AiOutlineClose />
        </button>
        <div className="flex items-center space-x-2">
          <img src={Logo123} alt="Logo" className="h-10" />
          <h1 className="text-xl font-bold text-white">StudyONE</h1>
        </div>
      </div>
      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-scroll scrollbar">
        <ul className="flex flex-col flex-grow">
          {SidebarData.map((item, index) => (
            <li
              key={index}
              className="flex items-center py-2 px-3 bg-black hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 rounded-lg mx-2 my-1"
            >
              <Link
                to={item.path}
                className="flex items-center text-emerald-300 text-lg w-full"
              >
                {item.icon}
                <span className="ml-3 text-white">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto mb-4">
          {ExtraMenuData.map((item, index) => (
            <li
              key={index}
              className="flex items-center py-2 px-3 bg-black hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 rounded-lg mx-2 my-1 cursor-pointer"
              onClick={() => handleAction(item.action)}
              aria-label={item.title} // Accessibility improvement
            >
              <span className="flex items-center text-emerald-300 text-lg w-full">
                {item.icon}
                <span className="ml-3 text-white">{item.title}</span>
              </span>
            </li>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
