import bcrypt from 'bcryptjs';
import { User } from '../modals/UserModal.js';
import axios from 'axios';

/**
 * Registers a new user.
 * @param {string} [googleAccessToken] - Google OAuth token (optional).
 * @param {string} [name] - User's name (required if not using Google OAuth).
 * @param {string} [email] - User's email (required).
 * @param {string} [password] - User's password (required if not using Google OAuth).
 * @returns {Object} - Newly created user object.
 * @throws {Error} - Throws an error if the user already exists or if there are issues during registration.
 */
export const register = async (googleAccessToken, name, email, password) => {
    if (googleAccessToken) {
        try {
            // Fetch user information from Google
            const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    "Authorization": `Bearer ${googleAccessToken}`
                }
            });

            const gname = response?.data?.name;
            const gemail = response?.data?.email;
            const picture = response?.data?.picture;

            // Check if user already exists
            const existingUser = await User.findOne({ email: gemail }).select("email");
            if (existingUser) {
                throw new Error("User already exists!");
            }

            // Create a new user
            const user = await User.create({ name: gname, email: gemail, profilePicture: picture });
            return user;
        } catch (error) {
            throw new Error(error.message); // Handle errors during registration
        }
    } else {
        try {
            // Check if user already exists
            const userExists = await User.findOne({ email });
            if (userExists) {
                throw new Error("User already exists");
            }

            // Create a new user with a hashed password
            const user = await User.create({
                name,
                email,
                password: bcrypt.hashSync(password, 12),
            });

            return user;
        } catch (error) {
            throw new Error(error.message); // Handle errors during registration
        }
    }
}

/**
 * Logs in a user.
 * @param {string} [googleAccessToken] - Google OAuth token (optional).
 * @param {string} [email] - User's email (required).
 * @param {string} [password] - User's password (required if not using Google OAuth).
 * @returns {Object} - User object if login is successful.
 * @throws {Error} - Throws an error if the user does not exist or credentials are invalid.
 */
export const login = async (googleAccessToken, email, password) => {
    if (googleAccessToken) {
        try {
            // Fetch user information from Google
            const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { "Authorization": `Bearer ${googleAccessToken}` }
            });

            const gemail = response?.data?.email;

            // Find user by email
            const user = await User.findOne({ email: gemail });
            if (!user) {
                throw new Error("User does not exist");
            }
            return user;
        } catch (error) {
            throw new Error(error.message); // Handle errors during login
        }
    } else {
        try {
            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("User does not exist");
            }

            // Compare provided password with stored hashed password
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                throw new Error("Invalid credentials");
            }
            return user;
        } catch (error) {
            throw new Error(error.message); // Handle errors during login
        }
    }
}
