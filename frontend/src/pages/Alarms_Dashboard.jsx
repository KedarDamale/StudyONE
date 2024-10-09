import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion"; // Import Framer Motion

const Alarms = () => {
  const [alarms, setAlarms] = useState([]);
  const [newAlarm, setNewAlarm] = useState({
    title: "",
    description: "",
    time: "",
  });
  const [editingAlarm, setEditingAlarm] = useState(null); // Track the alarm being edited
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

  // Create a new alarm or update an existing one
  const handleSaveAlarm = async (e) => {
    e.preventDefault();
    if (!newAlarm.title || !newAlarm.time) {
      alert("Title and Time are required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const formattedTime = new Date(newAlarm.time).toISOString(); // Ensure correct time format
      const payload = { ...newAlarm, userId, time: formattedTime }; // Prepare payload

      if (editingAlarm) {
        // Update existing alarm
        const url = `${API_URL}/${editingAlarm._id}`;
        await axios.put(url, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setEditingAlarm(null); // Reset editing state
      } else {
        // Create new alarm
        await axios.post(API_URL, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      setNewAlarm({ title: "", description: "", time: "" }); // Reset form fields
      fetchAlarms(); // Fetch alarms again to include the new/updated one
    } catch (error) {
      setError(
        "Error saving alarm: " +
          (error.response ? error.response.data.message : error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete an alarm
  const handleDeleteAlarm = async (alarmId) => {
    if (window.confirm("Are you sure you want to delete this alarm?")) {
      setLoading(true);
      setError(null);
      try {
        const url = `${API_URL}/${alarmId}`;
        await axios.delete(url, {
          data: { userId }, // Pass userId in the request body
          headers: {
            "Content-Type": "application/json",
          },
        });
        fetchAlarms(); // Fetch alarms again to refresh the list
      } catch (error) {
        setError(
          "Error deleting alarm: " +
            (error.response ? error.response.data.message : error.message)
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Edit an alarm
  const handleEditAlarm = (alarm) => {
    setNewAlarm({
      title: alarm.title,
      description: alarm.description,
      time: new Date(alarm.time).toISOString().slice(0, 16), // Set correct format for datetime-local input
    });
    setEditingAlarm(alarm); // Set the alarm to be edited
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">
      <h1 className="text-3xl mb-4">Alarms and Trackers</h1>
      {loading && <p className="text-yellow-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSaveAlarm} className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newAlarm.title}
          onChange={(e) => setNewAlarm({ ...newAlarm, title: e.target.value })}
          required
          className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-800 text-white"
        />
        <input
          type="text"
          placeholder="Description"
          value={newAlarm.description}
          onChange={(e) =>
            setNewAlarm({ ...newAlarm, description: e.target.value })
          }
          className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-800 text-white"
        />
        <input
          type="datetime-local"
          value={newAlarm.time}
          onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
          required
          className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-800 text-white"
        />

        {/* Framer Motion Button */}
        <motion.button
          className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
          font-bold rounded-lg shadow-lg hover:from-green-600
          hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          focus:ring-offset-gray-900 transition duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
        >
          {editingAlarm ? "Update Alarm" : "Add Alarm"}
        </motion.button>
      </form>
      <ul>
        {Array.isArray(alarms) &&
          alarms.map((alarm) => (
            <li
              key={alarm._id}
              className="mb-4 p-4 border border-gray-700 rounded bg-gray-800"
            >
              <h3 className="text-xl font-semibold">{alarm.title}</h3>
              <p className="text-gray-400">{alarm.description}</p>
              <p className="text-gray-300">
                Time: {new Date(alarm.time).toLocaleString()}
              </p>
              <motion.button
                onClick={() => handleEditAlarm(alarm)}
                className="mr-2 p-2 bg-green-500 text-white rounded hover:bg-green-400 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Edit
              </motion.button>
              <motion.button
                onClick={() => handleDeleteAlarm(alarm._id)}
                className="p-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Delete
              </motion.button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Alarms;
