import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { updateTodoDrag, getTodos, addTodo } from '../Services';
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { RxEyeOpen } from "react-icons/rx";
import TaskViewModal from './TaskViewModal';
import { Modal, Select } from 'antd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskDeleteModal from './TaskDeleteModal';
import TaskUpdateModal from './TaskUpdateModal';

const ItemType = 'TASK'; // Define item type for drag and drop
const { Option } = Select;

const Task = ({ task, index, moveTask, status, getTodoApi }) => {
    const [openView, setOpenView] = useState(false);
    const [deleteView, setDeleteView] = useState(false);
    const [updateView, setUpdateView] = useState(false);

    // Drag and Drop functionality using react-dnd library
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { ...task, index, status },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <>
            <div
                ref={drag}
                style={{
                    opacity: isDragging ? 0.5 : 1,
                    padding: 16,
                    color: 'white',
                    cursor: 'move',
                    fontWeight: 'bold',
                }}
                className='bg-gray-500'
            >
                <p>{task?.title}</p>
                <p className='text-gray-300 font-normal'>Description: {task?.description}</p>
                <p className='text-xs mt-1'>{`Created: ${new Date(task?.createdAt).toDateString()}`}</p>
            </div>
            <div className='flex items-center justify-end gap-5 bg-gray-500 pb-3 pr-2 mb-3'>
                <FaRegEdit data-testid="edit-button"  className='text-blue-500 cursor-pointer' onClick={() => setUpdateView(true)} />
                <MdDelete  data-testid="delete-button" className='text-red-500 cursor-pointer' onClick={() => setDeleteView(true)} />
                <RxEyeOpen data-testid="open-button"  className='text-green-500 cursor-pointer' onClick={() => setOpenView(true)} />
            </div>
            <TaskViewModal openView={openView} setOpenView={setOpenView} task={task} />
            <TaskDeleteModal deleteView={deleteView} setDeleteView={setDeleteView} task={task} getTodoApi={getTodoApi} />
            <TaskUpdateModal editView={updateView} setEditView={setUpdateView} title={task?.title} description={task?.description} getTodoApi={getTodoApi} task={task} />
        </>
    );
};

// Column component to display tasks in different columns
const Column = ({ column, status, moveTask, getTodoApi }) => {
    const [, drop] = useDrop({
        accept: ItemType,
        drop: (item) => {
            if (item.status !== status) {
                moveTask(item, status);
                toast.success(`Task moved to ${status==='done'? 'completed': status} column`);
            }
        },
    });

    return (
        <div
            ref={drop}
            className='m-2 p-2 bg-gray-200 rounded-lg flex-grow min-h-[300px] lg:min-h-[500px] w-full sm:w-1/2 lg:w-1/3'
        >
            <h2 className='text-black font-bold text-lg lg:text-xl mb-1'>{column?.name}</h2>
            <div className='overflow-y-auto max-h-52 lg:max-h-[65vh]'>
                {column?.items?.map((task, index) => (
                    <Task key={task?.id} task={task} index={index} moveTask={moveTask} status={status} getTodoApi={getTodoApi} />
                ))}
            </div>
        </div>
    );
};

// TodoList component to display all tasks
const TodoList = () => {
    const [columns, setColumns] = useState({
        pending: { name: 'Pending', items: [] },
        ongoing: { name: 'Ongoing', items: [] },
        done: { name: 'Completed', items: [] },
    });
    const [originalColumns, setOriginalColumns] = useState({
        pending: { name: 'Pending', items: [] },
        ongoing: { name: 'Ongoing', items: [] },
        done: { name: 'Completed', items: [] },
    });
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('');

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('default');

    // Fetch all tasks from the API
    const getTodoApi = async () => {
        try {
            const token = localStorage.getItem('todoToken');
            const response = await getTodos(token);
            const tasks = response?.tasks;

            const pending = tasks.filter(task => task.status === 'pending');
            const ongoing = tasks.filter(task => task.status === 'ongoing');
            const done = tasks.filter(task => task.status === 'done');

            const newColumns = {
                pending: { name: 'Pending', items: pending },
                ongoing: { name: 'Ongoing', items: ongoing },
                done: { name: 'Completed', items: done },
            };

            setColumns(newColumns);
            setOriginalColumns(newColumns);

        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    useEffect(() => {
        getTodoApi();
    }, [])

    // Add new task to the API
    const handleSubmit = async () => {
        if (!title || !description) {
            return toast.error('Please fill all fields');
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('todoToken'); // Get token from local storage
            const response = await addTodo(token, title, description); // Call addTodo service to add new task
            if (response?.status) {
                toast.success(response?.message);
                setOpen(false);
                getTodoApi();
            } else {
                setLoading(false);
                toast.error(response?.message);
            }
        } catch (error) {
            toast.error('Failed to add task');
        } finally {
            setLoading(false);
            setTitle('');
            setDescription('');
        }
    }

    const handleCancel = () => { // Close modal and reset form fields 
        setOpen(false);
        setTitle('');
        setDescription('');
    };

    // Move task to different columns based on status
    const moveTask = async (task, newStatus) => {
        const sourceColumn = columns[task.status];
        const destColumn = columns[newStatus];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(task.index, 1);
        removed.status = newStatus;
        destItems.push(removed);

        try {
            const token = localStorage.getItem('todoToken');
            await updateTodoDrag(token, task?._id, task?.title, task?.description, newStatus); // Call updateTodoDrag service to update task status
            getTodoApi();
        } catch (error) {
            console.error('Failed to update task status', error);
        }
        // Update columns with new task status and items
        setColumns({
            ...columns,
            [task.status]: {
                ...sourceColumn,
                items: sourceItems,
            },
            [newStatus]: {
                ...destColumn,
                items: destItems,
            },
        });
    };

    // Filter tasks based on search term 
    const handleFilterChange = (value) => {
        setFilter(value);
        if (value === 'recent') {
            setColumns({
                pending: {
                    name: 'Pending',
                    items: columns.pending.items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
                },
                ongoing: {
                    name: 'Ongoing',
                    items: columns.ongoing.items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
                },
                done: {
                    name: 'Completed',
                    items: columns.done.items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
                },
            });
        } else {
            getTodoApi();
        }
    }
// Search tasks based on title
    const handleSearchChange = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearch(searchTerm);

        const filterTasks = (tasks) => tasks.filter(task => task.title.toLowerCase().includes(searchTerm));

        setColumns({
            pending: {
                name: 'Pending',
                items: filterTasks(originalColumns.pending.items),
            },
            ongoing: {
                name: 'Ongoing',
                items: filterTasks(originalColumns.ongoing.items),
            },
            done: {
                name: 'Completed',
                items: filterTasks(originalColumns.done.items),
            },
        });
    };

    return (
        <>
        {/* Drag and Drop provider */}
            <DndProvider backend={HTML5Backend}>
                {/* Search and filter tasks */}
                <div className='min-h-screen bg-gray-300'>
                    <div className='flex flex-wrap items-center justify-between m-4'>
                        <input
                            className='rounded-md border-[#E9522C] py-2 px-4 shadow-sm focus:ring-[#E9522C] focus:border-[#E9522C] sm:text-sm mt-3 text-black'
                            placeholder='Search by title'
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <div className='flex items-center gap-4 mt-4'>
                            <Select className='w-48' defaultValue="default" onChange={handleFilterChange}>
                                <Option value="default">Default</Option>
                                <Option value="recent">Recent</Option>
                            </Select>
                            <button
                                className='bg-[#E9522C] text-white px-4 py-1 rounded-lg shadow-lg hover:bg-[#E9522C]/80 focus:outline-none'
                                onClick={() => setOpen(true)}
                            >
                                Add New Task
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-6 m-4'>
                        {Object.keys(columns).map((key, index) => (
                            <Column key={index} column={columns[key]} status={key} moveTask={moveTask} getTodoApi={getTodoApi} />
                        ))}
                    </div>
                </div>
            </DndProvider>
            <Modal
                title="Add New Task"
                open={open}
                onOk={handleSubmit}
                confirmLoading={loading}
                onCancel={handleCancel}
                footer={[
                    <button key="back" onClick={handleCancel} className='border py-2 rounded-md w-[100px] bg-gray-300 hover:opacity-[90%] font-bold'>
                        Cancel
                    </button>,
                    <button key="submit" loading={loading} onClick={handleSubmit} disabled={loading} className={`ml-2 ${!loading ? "bg-[#E9522C]" : "bg-[#f3876b]"} py-2 rounded-md hover:opacity-[90%] w-[100px] text-white font-bold`}>
                        {!loading ? 'Add' : 'Adding'}
                    </button>
                ]}
            >
                <input
                    type="text"
                    className='w-full px-4 py-2 border rounded-lg mb-4'
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className='w-full px-4 py-2 border rounded-lg'
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Modal>
        </>
    );
};

export default TodoList;
