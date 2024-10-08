import { IoLibrary } from "react-icons/io5";
import { ImPencil2 } from "react-icons/im";
import { FaRobot, FaDesktop, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { MdAccessAlarms } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import Logo123 from "../assets/Logo123.png";
import { useAuthStore } from "../store/authStore";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const SidebarData = [
  { title: "Home", icon: <FaHome />, page: "Home" },
  //{ title: "My Library", icon: <IoLibrary />, page: "MyLibrary" },
  { title: "Whiteboard", icon: <ImPencil2 />, page: "Whiteboard" },
  { title: "Lecture 2 Notes", icon: <FaRobot />, page: "LectureToNotes" },
  { title: "Interview Hub", icon: <FaDesktop />, page: "InterviewHub" },
  //{ title: "Expense Tracker", icon: <RiMoneyRupeeCircleLine />, page: "ExpenseTracker" },
  { title: "Alarms & Trackers", icon: <MdAccessAlarms />, page: "Alarms" },
];

const ExtraMenuData = [
  { title: "Sign Out", icon: <FaSignOutAlt />, action: "logout" },
];

function Sidebar({ isOpen, toggleSidebar, setActivePage }) {
  const { logout } = useAuthStore();

  const handleAction = async (action) => {
    if (action === "logout") {
      await logout();
    }
  };

  const handlePageChange = (page) => {
    if (page === "Whiteboard") {
      // Redirect to YouTube
      window.open("https://studyone-drawingboard.vercel.app/", "_blank"); // Opens in a new tab
    } else {
      setActivePage(page);   // Set the active page
      toggleSidebar();       // Close the sidebar
    }
  };

  return (
    <nav className={`fixed top-0 left-0 h-full w-60 bg-black transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} z-50 shadow-lg`}>
      <div className="flex items-center px-4 bg-black h-16">
        <button className="text-2xl text-white mr-4 hover:text-emerald-300" onClick={toggleSidebar} aria-label="Close Sidebar">
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
              className="flex items-center py-2 px-3 bg-black hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 rounded-lg mx-2 my-1 cursor-pointer"
              onClick={() => handlePageChange(item.page)}  // Close sidebar after page change
            >
              <span className="flex items-center text-emerald-300 text-lg w-full">
                {item.icon}
                <span className="ml-3 text-white">{item.title}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-auto mb-4">
          {ExtraMenuData.map((item, index) => (
            <div
              key={index}
              className="flex items-center py-2 px-3 bg-black hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 rounded-lg mx-2 my-1 cursor-pointer"
              onClick={() => (item.action ? handleAction(item.action) : handlePageChange(item.page))}  // Handle logout or page change
            >
              <span className="flex items-center text-emerald-300 text-lg w-full">
                {item.icon}
                <span className="ml-3 text-white">{item.title}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
