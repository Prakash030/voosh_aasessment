import { Task } from "../modals/Tasks.js";

/**
 * Creates a new task.
 * @param {string} userId - The ID of the user creating the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @returns {Object} - The newly created task object.
 * @throws {Error} - Throws an error if task creation fails.
 */
export const createTask = async (userId, title, description) => {
    try {
        const task = await Task.create({
            userId,
            title,
            description
        });
        return task;
    } catch (error) {
        throw new Error(error.message); // Handle errors during task creation
    }
}

/**
 * Retrieves tasks for a specific user.
 * @param {string} userId - The ID of the user whose tasks are being retrieved.
 * @returns {Array} - Array of task objects for the user.
 * @throws {Error} - Throws an error if fetching tasks fails.
 */
export const getTasks = async (userId) => {
    try {
        const tasks = await Task.find({ userId });
        return tasks;
    } catch (error) {
        throw new Error(error.message); // Handle errors during task retrieval
    }
}

/**
 * Updates an existing task.
 * @param {string} taskId - The ID of the task to be updated.
 * @param {string} title - The new title of the task.
 * @param {string} description - The new description of the task.
 * @param {string} [status] - The new status of the task (optional).
 * @returns {Object} - The updated task object.
 * @throws {Error} - Throws an error if the task is not found or update fails.
 */
export const updateTask = async (taskId, title, description, status) => {
    console.log(taskId, title, description, status); // Debugging

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            throw new Error("Task not found");
        }

        task.title = title;
        task.description = description;
        if (status) {
            task.status = status;
        }
        console.log(task); // Debugging

        await task.save();
        return task;
    } catch (error) {
        throw new Error(error.message); // Handle errors during task update
    }
}

/**
 * Deletes a specific task.
 * @param {string} taskId - The ID of the task to be deleted.
 * @returns {boolean} - Returns true if the task was successfully deleted.
 * @throws {Error} - Throws an error if the task is not found or deletion fails.
 */
export const deleteTask = async (taskId) => {
    try {
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            throw new Error("Task not found");
        }
        return true; // Indicates successful deletion
    } catch (error) {
        throw new Error(error.message); // Handle errors during task deletion
    }
}

/**
 * Deletes all tasks for a specific user.
 * @param {string} userId - The ID of the user whose tasks are to be deleted.
 * @returns {Array} - Array of tasks that were deleted.
 * @throws {Error} - Throws an error if no tasks are found or deletion fails.
 */
export const deleteAllTasks = async (userId) => {
    try {
        const tasks = await Task.find({ userId });
        if (!tasks.length) {
            throw new Error("Tasks not found");
        }

        await Task.deleteMany({ userId });
        return tasks; // Return the tasks that were deleted
    } catch (error) {
        throw new Error(error.message); // Handle errors during task deletion
    }
}
