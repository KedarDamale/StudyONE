import { motion } from "framer-motion";
import { Link } from "react-router-dom";



const NotFoundPage = () => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col justify-center items-center p-8"
    >
      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
      404
      </h1>
      <p className="text-xl text-white mb-6">
        Hello Oops! The page you're looking for doesn't exist.
      </p>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full max-w-xs"
      >
        <Link
          to="/dashboard"
          className="block py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 text-center"
        >
          Go Back To Dashboard
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundPage;
