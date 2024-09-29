import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearUserInfo } from '../Utils/userActions'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user information from Redux store
  const user = useSelector((state) => state.user.userInfo);

  /**
   * Handles user logout
   * - Displays a success toast
   * - Removes token from localStorage
   * - Clears user info from the store
   * - Navigates to login page
   */
  const handleLogout = () => {
    toast.success('Logged out successfully');
    localStorage.removeItem('todoToken');
    dispatch(clearUserInfo());
    navigate('/login');
  }

  console.log(user);

  return (
    <>
      {/* Header section with logo, profile image, and logout button */}
      <div className='flex items-center justify-between bg-gray-500 rounded-md px-5 py-2'>
        <h1 className='text-xl font-bold text-white sm:text-lg'>Todo List</h1>

        <div className='flex items-center justify-center gap-10 sm:gap-4'>
          {/* User Profile Image */}
          <img
            src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random&size=128`}
            alt={user?.name || "User"}
            style={{ height: '50px', width: '50px', objectFit: 'cover' }}
            className='rounded-full sm:h-10 sm:w-10'
          />

          {/* Logout Button */}
          <button 
            className="bg-[#E9522C] hover:bg-[#E9522C]/90 px-4 py-2 rounded-md text-white" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Toast notification container */}
      {/* <ToastContainer /> */}
    </>
  )
}

export default Header;
