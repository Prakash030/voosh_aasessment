import { getTasks, createTask, updateTask, deleteAllTasks, deleteTask } from "../services/taskService.js";

/**
 * Controllers to handle the task related operations.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createTaskController = async (req, res, next) => {
    try {
        const userId = req?.user?._id; // Get user ID from req.user
        if (!userId) {
            throw new Error("Unauthorized"); // Throw error if user ID is not found
        }

        const { title, description } = req?.body; // Destructure title and description from req.body
        if (!title || !description) {
            throw new Error("Please fill all fields"); // Throw error if title or description is missing
        }

        const task = await createTask(userId, title, description); // Call createTask function from taskService.js

        return res.status(200).json({
            status: true,
            task: task,
            message: "Task created successfully"
        });
    } catch (error) {
        next(error); // Pass error to the error handling middleware
    }
}

export const getTasksController = async (req, res, next) => {
    try {
        const userId = req?.user?._id; // Get user ID from req.user
        if (!userId) {
            throw new Error("Unauthorized"); // Throw error if user ID is not found
        }

        const tasks = await getTasks(userId); // Call getTasks function from taskService.js

        return res.status(200).json({
            status: true,
            tasks: tasks,
            message: "Tasks fetched successfully"
        });
    } catch (error) {
        next(error); // Pass error to the error handling middleware
    }
}

export const updateTaskController = async (req, res, next) => {
    try {
        const user = req?.user; // Get user from req.user
        if (!user) {
            throw new Error("Unauthorized"); // Throw error if user is not found
        }

        const taskId = req?.params?.id; // Get task ID from req.params
        if (!taskId) {
            throw new Error("Task ID is required"); // Throw error if task ID is missing
        }

        const { title, description, status } = req?.body; // Destructure title, description, and status from req.body
        if (!title || !description) {
            throw new Error("Please fill all fields"); // Throw error if title or description is missing
        }

        const task = await updateTask(taskId, title, description, status); // Call updateTask function from taskService.js

        return res.status(200).json({
            status: true,
            task: task,
            message: "Task updated successfully"
        });
    } catch (error) {
        next(error); // Pass error to the error handling middleware
    }
}

export const deleteTaskController = async (req, res, next) => {
    try {
        const user = req?.user; // Get user from req.user
        if (!user) {
            throw new Error("Unauthorized"); // Throw error if user is not found
        }

        const taskId = req?.params?.id; // Get task ID from req.params
        if (!taskId) {
            throw new Error("Task ID is required"); // Throw error if task ID is missing
        }

        const task = await deleteTask(taskId); // Call deleteTask function from taskService.js

        return res.status(200).json({
            status: true,
            task: task,
            message: "Task deleted successfully"
        });
    } catch (error) {
        next(error); // Pass error to the error handling middleware
    }
}

export const deleteAllTasksController = async (req, res, next) => {
    try {
        const user = req?.user; // Get user from req.user
        if (!user) {
            throw new Error("Unauthorized"); // Throw error if user is not found
        }

        const tasks = await deleteAllTasks(user?._id); // Call deleteAllTasks function from taskService.js

        return res.status(200).json({
            tasks: tasks,
            message: "Tasks deleted successfully"
        });
    } catch (error) {
        next(error); // Pass error to the error handling middleware
    }
}
