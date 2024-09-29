import React, { useState } from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import { updateTodo } from '../Services';

const TaskUpdateModal = ({
    editView,
    setEditView,
    title,
    description,
    getTodoApi,
    task
}) => {
    const [loading, setLoading] = useState(false); // State to manage button loading
    const [newTitle, setTitle] = useState(title); // State for new task title
    const [newDescription, setDescription] = useState(description); // State for new task description

    // Function to handle the modal cancel action
    const handleEditCancel = () => {
        setEditView(false); // Close the modal
    };

    // Function to handle task update
    const handleUpdate = async () => {
        if (!newTitle || !newDescription) {
            return toast.error('Please fill all fields'); // Show error if fields are empty
        }
        setLoading(true); // Set loading state to true
        try {
            const token = localStorage.getItem('todoToken'); // Get token from local storage
            const response = await updateTodo(token, task?._id, newTitle, newDescription); // Call update API
            if (response?.status) {
                toast.success(response?.message); // Show success message
                setEditView(false); // Close the modal
                getTodoApi(); // Refresh the task list
            } else {
                toast.error(response?.message); // Show error message
            }
        } catch (error) {
            console.error("Something went wrong", error); // Log error
            toast.error('Failed to update task'); // Show error message
        } finally {
            setLoading(false); // Set loading state to false
            setTitle(''); // Clear title state
            setDescription(''); // Clear description state
        }
    };

    return (
        <Modal
            open={editView} // Control modal visibility
            title="Edit Task" // Modal title
            onOk={handleUpdate} // Handle update on confirm
            onCancel={handleEditCancel} // Handle cancel on close
            footer={[
                <button
                    key="back"
                    onClick={handleEditCancel}
                    className='border py-2 rounded-md w-[100px] bg-gray-300 hover:opacity-[90%] font-bold'
                >
                    Cancel
                </button>,
                <button
                    key="submit"
                    onClick={handleUpdate}
                    disabled={loading} // Disable button while loading
                    className={`ml-2 ${!loading ? "bg-[#E9522C]" : "bg-[#f3876b]"} py-2 rounded-md hover:opacity-[90%] w-[100px] text-white font-bold`}
                >
                    {loading ? 'Updating' : 'Update'} {/* Button text based on loading state */}
                </button>
            ]}
        >
            <div>
                <input
                    className="mt-2 w-full px-5 py-3 rounded-lg font-medium border-2 border placeholder-gray-500 text-sm focus:border-2 focus:outline text-black focus:border-white"
                    type="text"
                    value={newTitle} // Controlled input for task title
                    onChange={(e) => setTitle(e.target.value)} // Update title state
                    placeholder="Enter Task Title" // Placeholder text
                />
                <textarea
                    className="mt-5 w-full px-5 py-3 rounded-lg font-medium border-2 border placeholder-gray-500 text-sm focus:border-2 focus:outline text-black focus:border-white"
                    rows={5}
                    value={newDescription} // Controlled textarea for task description
                    onChange={(e) => setDescription(e.target.value)} // Update description state
                    placeholder="Enter Task Description" // Placeholder text
                />
            </div>
        </Modal>
    );
};

export default TaskUpdateModal;
