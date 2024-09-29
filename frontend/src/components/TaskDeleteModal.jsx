import React from 'react';
import { Modal } from 'antd';
import { deleteTodo } from '../Services';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskDeleteModal = ({ deleteView, setDeleteView, task, getTodoApi }) => {
    const [dloading, setDloading] = React.useState(false); // State to manage delete button loading

    // Function to handle task deletion
    const handleDelete = async (id) => {
        setDloading(true); // Start loading state
        try {
            const token = localStorage.getItem('todoToken');
            const response = await deleteTodo(token, id); // Call delete API
            if (response?.status) {
                toast.success(response?.message); // Show success message
                setDeleteView(false); // Close modal
                getTodoApi(); // Refresh task list
            } else {
                toast.error(response?.message); // Show error message
            }
        } catch (error) {
            console.error("Something went wrong", error); // Log error
            toast.error('Failed to delete task'); // Show error message
        } finally {
            setDloading(false); // Stop loading state
        }
    }

    return (
        <Modal
            open={deleteView} // Control modal visibility
            title="Delete Task" // Modal title
            onOk={() => { handleDelete(task?._id) }} // Delete task on confirm
            onCancel={() => setDeleteView(false)} // Close modal on cancel
            footer={[
                <button
                    key="back"
                    onClick={() => setDeleteView(false)}
                    className='border py-2 rounded-md w-[100px] bg-gray-300 hover:opacity-[90%] font-bold'
                >
                    Cancel
                </button>,
                <button
                    key="submit"
                    loading={false}
                    onClick={() => { handleDelete(task?._id) }}
                    disabled={dloading}
                    className={`ml-2 ${!dloading ? "bg-[#E9522C]" : "bg-[#f3876b]"} py-2 rounded-md hover:opacity-[90%] w-[100px] text-white font-bold`}
                >
                    {dloading ? 'Deleting' : 'Delete'} {/* Button text based on loading state */}
                </button>
            ]}
        >
            <div>
                <p className='text-xl font-bold'>Are you sure you want to delete this task?</p> {/* Modal content */}
            </div>
        </Modal>
    )
}

export default TaskDeleteModal;
