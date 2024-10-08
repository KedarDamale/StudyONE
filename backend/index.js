// Import necessary modules for the application
import express from "express"; 
import dotenv from "dotenv"; 
import cors from "cors"; 
import cookieParser from "cookie-parser"; 
import path from "path"; 
import axios from "axios"; // Import axios to send requests

// Import the database connection function
import { connectDB } from "./db/connectDB.js";

// Import authentication routes
import authRoutes from "./routes/auth.route.js"; 
import chatRoutes from './routes/chat.route.js';
import lecture2NotesRoutes from './routes/lecture2notes.route.js';

// Load environment variables from .env file
dotenv.config(); 

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000; 

// Resolve the directory name for serving static files
const __dirname = path.resolve(); 

// Use CORS middleware with specific origin
app.use(cors({ origin: "http://localhost:5173", credentials: true })); 

// Middleware to parse JSON data
app.use(express.json()); 

// Middleware to parse cookies
app.use(cookieParser()); 

// Route for handling authentication-related requests
app.use("/api/auth", authRoutes); 
app.use("/", chatRoutes); 
app.use('/api/lecture2notes', lecture2NotesRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend", "dist")));

    // Handle all other routes by serving the main index.html file
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// Function to visit the specified URL
const visitURL = async () => {
    try {
        const response = await axios.get("https://hackathondraw.onrender.com/");
        console.log("Visited URL: https://hackathondraw.onrender.com/");
        console.log("Response status:", response.status);
        console.log("Visited the URL at:", new Date().toLocaleString()); // Log the time of the visit
    } catch (error) {
        console.error("Error visiting the URL:", error.message);
    }
};

// Start the server and listen on the specified port
const startServer = async () => {
    try {
        await connectDB(); // Connect to the database

        app.listen(PORT, () => {
            console.log("Server is running on port:", PORT); 

            // Initial visit
            visitURL(); 
            // Set interval for subsequent visits every 3 minutes (180,000 milliseconds)
            setInterval(visitURL, 180000); 
        });
    } catch (error) {
        console.error("Error connecting to the database:", error.message); 
    }
};

startServer();
