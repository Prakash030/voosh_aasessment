// Import required modules
import express from 'express'; // Express framework for building web applications
import bodyParser from 'body-parser'; // Middleware to parse incoming request bodies
import cors from 'cors'; // Middleware to enable Cross-Origin Resource Sharing
import { configDotenv } from 'dotenv'; // Load environment variables from a .env file
import { connectDB } from './db.js'; // Custom function to connect to the database
import userRoutes from './routes/userRoutes.js'; // Routes related to user operations
import taskRoutes from './routes/taskRoutes.js'; // Routes related to task operations
import { errorResponse } from './middleware/errorHandler.js'; // Custom middleware for error handling

// Load environment variables from a .env file into process.env
configDotenv();

// Create an instance of the Express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Middleware to parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Define the port on which the server will listen
const PORT = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000

// Mount the user routes on the '/api/v1/' path
app.use('/api/v1/', userRoutes);

// Mount the task routes on the '/api/v1/task' path
app.use('/api/v1/task', taskRoutes);

// Use custom error handling middleware to catch and respond to errors
app.use(errorResponse);

// Start the server and connect to the database
app.listen(PORT, () => {
    connectDB(); // Connect to the database
    console.log(`Server is running on port ${PORT}`); // Log the server status
});
