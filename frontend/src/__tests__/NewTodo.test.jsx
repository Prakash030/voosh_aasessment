import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TodoList from '../components/NewTodo'; // Adjust the path based on your file structure
import { getTodos, addTodo, updateTodoDrag } from '../Services';
import { toast } from 'react-toastify';

// Mock services
jest.mock('../Services');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('react-dnd', () => ({
    DndProvider: ({ children }) => children,
    useDrag: () => [jest.fn(), {}],
    useDrop: () => [{}],
  }));
  
  jest.mock('react-dnd-html5-backend', () => ({}));

  jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
  }));
  
  

describe('TodoList component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Component renders correctly
  it('should render TodoList component', () => {
    render(<TodoList />);
    expect(screen.getByPlaceholderText('Search by title')).toBeInTheDocument();
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
  });

  // Test 2: Tasks are fetched from the API
  it('should fetch and display tasks', async () => {
    const mockTasks = {
      tasks: [
        { _id: '1', title: 'Task 1', description: 'Task 1 description', status: 'pending', createdAt: new Date() },
        { _id: '2', title: 'Task 2', description: 'Task 2 description', status: 'ongoing', createdAt: new Date() },
      ],
    };
    
    getTodos.mockResolvedValueOnce(mockTasks);
    render(<TodoList />);
    
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  it('add new task', async () => {
    addTodo.mockResolvedValueOnce({ status: true, message: 'Task added successfully' });
    render(<TodoList />);
    fireEvent.click(screen.getByText('Add New Task'));
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'New Task Description' } });
    fireEvent.click(screen.getByText('Add'));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Task added successfully');
    });
  })

});
