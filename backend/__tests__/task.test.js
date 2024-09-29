// tasks.test.js
import { createTask, getTasks, updateTask, deleteTask, deleteAllTasks } from '../services/taskService.js';
import { Task } from '../modals/Tasks.js';

jest.mock('../modals/Tasks.js');

describe('Task Management Functions', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('createTask should create and return a task', async () => {
        const newTask = { _id: '123', userId: 'user1', title: 'Test Task', description: 'Test Description' };
        Task.create.mockResolvedValue(newTask);

        const result = await createTask('user1', 'Test Task', 'Test Description');
        expect(result).toEqual(newTask);
        expect(Task.create).toHaveBeenCalledWith({ userId: 'user1', title: 'Test Task', description: 'Test Description' });
    });

    test('getTasks should return tasks for a specific user', async () => {
        const tasks = [{ _id: '123', userId: 'user1', title: 'Test Task', description: 'Test Description' }];
        Task.find.mockResolvedValue(tasks);

        const result = await getTasks('user1');
        expect(result).toEqual(tasks);
        expect(Task.find).toHaveBeenCalledWith({ userId: 'user1' });
    });

    test('updateTask should update and return the task', async () => {
        const existingTask = { _id: '123', userId: 'user1', title: 'Test Task', description: 'Test Description', status: 'pending' };
        const updatedTask = { _id: '123', userId: 'user1', title: 'Updated Task', description: 'Updated Description', status: 'completed' };
    
        // Mock Task.findById to return an object with a save method
        Task.findById.mockResolvedValue({
            ...existingTask,
            save: jest.fn().mockResolvedValue(updatedTask) // Mock save method to return updatedTask
        });
    
        const result = await updateTask('123', 'Updated Task', 'Updated Description', 'completed');
        
        // Use toMatchObject to compare the result without including the save method
        expect(result).toMatchObject(updatedTask);
        expect(Task.findById).toHaveBeenCalledWith('123');
    });
    
    

    test('deleteTask should delete and return true if task is deleted', async () => {
        Task.findByIdAndDelete.mockResolvedValue({ _id: '123' });

        const result = await deleteTask('123');
        expect(result).toBe(true);
        expect(Task.findByIdAndDelete).toHaveBeenCalledWith('123');
    });

    test('deleteAllTasks should delete all tasks for a user and return them', async () => {
        const tasks = [{ _id: '123', userId: 'user1', title: 'Test Task', description: 'Test Description' }];
        Task.find.mockResolvedValue(tasks);
        Task.deleteMany.mockResolvedValue({ deletedCount: tasks.length });

        const result = await deleteAllTasks('user1');
        expect(result).toEqual(tasks);
        expect(Task.find).toHaveBeenCalledWith({ userId: 'user1' });
        expect(Task.deleteMany).toHaveBeenCalledWith({ userId: 'user1' });
    });

    // Additional test cases

    test('createTask should handle errors', async () => {
        Task.create.mockRejectedValue(new Error('Database error'));

        await expect(createTask('user1', 'Test Task', 'Test Description')).rejects.toThrow('Database error');
    });

    test('getTasks should handle errors', async () => {
        Task.find.mockRejectedValue(new Error('Database error'));

        await expect(getTasks('user1')).rejects.toThrow('Database error');
    });

    test('updateTask should handle errors if task not found', async () => {
        Task.findById.mockResolvedValue(null);

        await expect(updateTask('123', 'Updated Task', 'Updated Description', 'completed')).rejects.toThrow('Task not found');
    });

    test('deleteTask should handle errors', async () => {
        Task.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

        await expect(deleteTask('123')).rejects.toThrow('Database error');
    });

    test('deleteAllTasks should handle errors', async () => {
        Task.find.mockRejectedValue(new Error('Database error'));

        await expect(deleteAllTasks('user1')).rejects.toThrow('Database error');
    });
});
