import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore"; // Ensure to import useAuthStore

const FactofTheDay = () => {
  const { user, isAuthenticated } = useAuthStore(); // Get user information
  const [fact, setFact] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  // Function to fetch the fact
  const fetchFact = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await fetch("https://api.api-ninjas.com/v1/facts", {
        method: "GET",
        headers: {
          "X-Api-Key": "N9HZKaK57OpNJ0CuercxJg==OdssZoMxHsmRcbaE", // Use your API key from .env
        },
      });

      // Check if the response is OK (status in the range 200-299)
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setFact(data[0].fact); // Assuming the API returns an array of facts
      setError(""); // Clear error if fetch is successful
    } catch (error) {
      console.error("Error fetching the fact of the day:", error);
      setError("Could not load fact for today.");
    } finally {
      setLoading(false); // Set loading to false after fetch attempt
    }
  };

  useEffect(() => {
    // Fetch fact immediately on mount
    fetchFact();

    // Set up interval to fetch fact every 15 minutes (900000 milliseconds)
    const intervalId = setInterval(() => {
      fetchFact();
    }, 900000); // 15 minutes

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Only runs once when the component mounts

  // Function to determine the appropriate greeting
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    else if (hours < 18) return "Good Afternoon";
    else return "Good Evening";
  };

  // Animation variants for the text
  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Render loading state, error, or fact
  return (
    <motion.div className="bg-gray-800 rounded-lg shadow-md p-4">
      <motion.h2
        className="text-lg font-semibold mb-1 text-white"
        initial="hidden"
        animate="visible"
        variants={textVariants}
      >
        {isAuthenticated && user
          ? `${getGreeting()}, ${user.name}!`
          : "Welcome!"}
      </motion.h2>
      <motion.h3
        className="text-lg font-semibold mb-1 text-white"
        initial="hidden"
        animate="visible"
        variants={textVariants}
      >
      Did You Know?
      </motion.h3>
      {loading ? (
        <motion.p
          className="text-base animate-pulse text-white"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          🔄 Loading...
        </motion.p>
      ) : error ? (
        <motion.p
          className="text-base text-red-400"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          {error} 🚫
        </motion.p>
      ) : (
        <motion.p
          className="text-base text-white"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          {fact}
        </motion.p>
      )}
    </motion.div>
  );
};

export default FactofTheDay;
