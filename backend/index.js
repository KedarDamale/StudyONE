// Import necessary modules for the application
import express from "express"; // Express is a web framework for Node.js, used to create and manage servers.
import dotenv from "dotenv"; // dotenv allows us to load environment variables from a .env file into process.env.
import cors from "cors"; // CORS (Cross-Origin Resource Sharing) enables a server to indicate any origins (domains) other than its own from which a browser should permit loading resources.
import cookieParser from "cookie-parser"; // cookieParser allows us to parse cookies attached to the client request object.
import path from "path"; // path provides utilities for working with file and directory paths.

// Import the database connection function
import { connectDB } from "./db/connectDB.js"; // This function will connect the app to the database.

// Import authentication routes
import authRoutes from "./routes/auth.route.js"; // These are the routes for user authentication, such as login and registration.
import chatRoutes from './routes/chat.route.js'; // Import chat routes
import lecture2NotesRoutes from './routes/lecture2notes.route.js';


// Load environment variables from .env file
dotenv.config(); // dotenv is configured to load environment variables from a .env file into process.env.

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000; // The app will listen on the port specified in the .env file or default to 5000.

// Resolve the directory name for serving static files
const __dirname = path.resolve(); // path.resolve() is used to get the absolute path of the current directory.

// Use CORS middleware with specific origin
app.use(cors({ origin: "http://localhost:5173", credentials: true })); 
// Enables CORS for requests from "http://localhost:5173" and allows credentials (cookies, HTTP authentication).

// Middleware to parse JSON data
app.use(express.json()); // Allows parsing of incoming requests with JSON payloads (req.body).

// Middleware to parse cookies
app.use(cookieParser()); // Parses cookies attached to incoming requests and makes them available under req.cookies.

// Route for handling authentication-related requests
app.use("/api/auth", authRoutes); // Routes that start with "/api/auth" will be handled by the authRoutes.
app.use("/", chatRoutes); // This registers routes starting with /api/chat
app.use('/api/lecture2notes', lecture2NotesRoutes);





// Serve static files in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend", "dist")));

    // Handle all other routes by serving the main index.html file
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// Start the server and listen on the specified port
const startServer = async () => {
    try {
        await connectDB(); // Connect to the database
        app.listen(PORT, () => {
            console.log("Server is running on port:", PORT); // Log the server start message
        });
    } catch (error) {
        console.error("Error connecting to the database:", error.message); // Log connection errors
    }
};

startServer();
