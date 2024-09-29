import express from 'express';
import authMiddleware from "../middleware/auth.js";
import { createTaskController, getTasksController, updateTaskController, deleteAllTasksController, deleteTaskController } from "../controllers/taskController.js";

const router = express.Router();

router.get('/', authMiddleware, getTasksController); // Controller function to handle task fetching
router.post('/create', authMiddleware, createTaskController); // Controller function to handle task creation
router.put('/update/:id', authMiddleware, updateTaskController); // Controller function to handle task updation
router.delete('/delete/:id', authMiddleware, deleteTaskController); // Controller function to handle task deletion
router.delete('/delete', authMiddleware, deleteAllTasksController); // Controller function to handle all task deletion

export default router;
