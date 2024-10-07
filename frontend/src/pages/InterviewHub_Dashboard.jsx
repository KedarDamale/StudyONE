import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader, Send, Trash2 } from "lucide-react"; // Lucide icons
import { useAuthStore } from "../store/authStore";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/chat"
    : "/api/chat";

const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-6 flex-1">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="w-5 h-5 text-green-500" />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
        style={{ maxWidth: "100%" }} // Ensuring input is responsive
      />
    </div>
  );
};

const InterviewHub = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const chatContainerRef = useRef(null);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  const handleMessageSend = async () => {
    if (!message.trim()) return;

    setHistory((prevHistory) => [
      ...prevHistory,
      { user: message, bot: null },
    ]);

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(API_URL, { message });
      const botResponse = res.data.response;

      setHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory[newHistory.length - 1].bot = botResponse;
        return newHistory;
      });
    } catch (error) {
      console.error("Error:", error);
      // Optionally add user feedback for error handling
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("chatHistory");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-900 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl w-full bg-gray-800 bg-opacity-60 backdrop-filter backdrop-blur-xl rounded-2xl shadow-lg flex flex-col h-[80vh] overflow-hidden"
      >
        <div
          ref={chatContainerRef}
          className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600"
          style={{ maxHeight: "calc(80vh - 80px)", width: "100%" }}
        >
          {history.length === 0 ? (
            <p className="text-center text-gray-400">
              No conversation yet. Start chatting below!
            </p>
          ) : (
            history.map((chat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="mb-4"
              >
                <div className="flex flex-col items-end">
                  <div className="bg-green-600 p-3 rounded-lg text-white max-w-sm">
                    <strong>{isAuthenticated && user ? user.name : "You"}</strong>: {chat.user}
                  </div>
                </div>
                {chat.bot && (
                  <div className="flex flex-col items-start mt-2">
                    <div className="bg-gray-700 p-3 rounded-lg text-white max-w-sm">
                      <strong className="text-green-500">StudyONE:</strong> {chat.bot}
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        <div className="p-4 bg-gray-900 flex items-center flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearHistory}
            className="bg-red-600 hover:bg-red-500 p-2 rounded-lg text-white mr-2"
          >
            <Trash2 className="w-6 h-6" />
          </motion.button>

          <Input
            icon={Send}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow" // Ensure the input grows to fill space
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMessageSend}
            className="bg-green-600 hover:bg-green-500 p-2 rounded-lg text-white ml-2"
            disabled={loading || !message.trim()}
          >
            {loading ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InterviewHub;
