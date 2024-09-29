// Import the mongoose library for interacting with MongoDB
import mongoose from "mongoose";

/**
 * Connects to the MongoDB database using Mongoose.
 * 
 * This function attempts to establish a connection to the MongoDB database using the connection string
 * provided in the environment variable `MONGO_URI`. It configures Mongoose to use the new URL parser
 * and unified topology options. Upon a successful connection, it logs a success message. If the connection
 * fails, it logs the error message and terminates the process with an exit code of 1.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} - A promise that resolves when the connection attempt is complete.
 */
export const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the connection URI from environment variables
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log a success message if the connection is successful
    console.log(`MongoDB Connected`);
  } catch (error) {
    // Log the error message if the connection fails
    console.error(`Error: ${error.message}`);
    
    // Exit the process with a failure code (1) if the connection fails
    process.exit(1);
  }
};
