import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const Alarms_DashboardPage = () => {
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user ID from the auth store
  const { user, isAuthenticated } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }));

  const userId = user?._id; // Assuming user object has an _id property

  // Define the API URL based on the environment
  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/alarms"
      : "/api/alarms";

  useEffect(() => {
    if (isAuthenticated) {
      fetchAlarms();
    } else {
      setError("User not authenticated. Please log in.");
    }
  }, [isAuthenticated]);

  // Fetch alarms from the backend
  const fetchAlarms = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_URL}/${userId}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setAlarms(response.data.alarms || []);
    } catch (error) {
      setError(
        "Error fetching alarms: " +
          (error.response ? error.response.data.message : error.message)
      );
      setAlarms([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to determine the alarm status based on time
  const getAlarmStatus = (alarmTime) => {
    const now = new Date();
    const alarmDate = new Date(alarmTime);
    const timeDiff = alarmDate - now; // Difference in milliseconds

    if (timeDiff <= 0) {
      return "Triggered"; // Alarm has already triggered
    } else if (timeDiff <= 24 * 60 * 60 * 1000) { // Less than 24 hours
      return "red";
    } else if (timeDiff <= 48 * 60 * 60 * 1000) { // Between 24 and 48 hours
      return "yellow";
    } else {
      return "green"; // More than 48 hours
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">
      <h1 className="text-3xl mb-4">Alarms Overview</h1>
      {loading && <p className="text-yellow-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div>
        {["green", "yellow", "red"].map((status) => (
          <div key={status} className="mb-4">
            <h3
              className={`text-xl ${
                status === "red"
                  ? "text-red-600"
                  : status === "yellow"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} Alarms
            </h3>
            {alarms
              .filter((alarm) => getAlarmStatus(alarm.time) === status)
              .map((alarm) => (
                <div
                  key={alarm._id}
                  className={`p-4 mb-2 border rounded bg-gray-800 border-${status}-600`}
                >
                  <h4 className="font-semibold">{alarm.title}</h4>
                  <p className="text-gray-400">
                    {new Date(alarm.time).toLocaleString()}
                  </p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alarms_DashboardPage;
