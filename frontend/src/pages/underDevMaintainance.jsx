import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaTools } from "react-icons/fa"; // Adding an icon for maintenance

const MaintenancePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col justify-center items-center p-8"
    >
      {/* Maintenance icon */}
      <FaTools className="text-6xl text-emerald-500 mb-4" />

      {/* Title */}
      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
        Under Maintenance
      </h1>
      
      {/* Description */}
      <p className="text-xl text-white mb-6">
        We are currently working on improvements. Please check back soon.
      </p>

      {/* Redirect to another page (e.g., Dashboard or Home) */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full max-w-xs"
      >
        <Link
          to="/"
          className="block py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 text-center"
        >
          Return to Landing Page
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default MaintenancePage;
