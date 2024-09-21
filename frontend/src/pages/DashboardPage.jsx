import { useState } from "react";
import Sidebar from "../components/Sidebar_DashboardPage";
import Navbar from "../components/Navbar_DashboardPage";

// Import components for different pages
import MyLibrary from "./MyLib_Dashboard";
import Whiteboard from "./Whiteboard_Dashboard";
import LectureToNotes from "./LectureToNotes_Dashboard";
import InterviewHub from "./InterviewHub_Dashboard";
import ExpenseTracker from "./ExpenseTracker_Dashboard";
import Alarms from "./Alarms_Dashboard";
import Home from "./Home_Dashboard";

const DashboardPage = () => {
  const [activePage, setActivePage] = useState("Home"); // Default page is MyLibrary
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    setSidebarOpen(false); // Automatically close the sidebar after selecting a page
  };

  // Render the component for the active page
  const renderActivePage = () => {
    switch (activePage) {
      case "Home":
        return <Home />;
      case "MyLibrary":
        return <MyLibrary />;
      case "Whiteboard":
        return <Whiteboard />;
      case "LectureToNotes":
        return <LectureToNotes />;
      case "InterviewHub":
        return <InterviewHub />;
      case "ExpenseTracker":
        return <ExpenseTracker />;
      case "Alarms":
        return <Alarms />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        setActivePage={handlePageChange} // Pass the new handlePageChange function
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Content Section */}
        <div className="flex-1 p-6 overflow-y-auto mt-16"> {/* Add 'mt-16' to push content below navbar */}
          {renderActivePage()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
