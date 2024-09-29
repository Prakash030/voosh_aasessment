import React, { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, Link } from "react-router-dom";
import {useGoogleLogin} from '@react-oauth/google';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { setUserInfo } from '../Utils/userActions';
import { register, registerGoogle } from "../Services";
import 'react-toastify/dist/ReactToastify.css';



const Signup = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const[confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async() => {

        if (!email || !password || !name || !confirmPassword) {
            return toast.error('All fields are required');
        }
        if(password !== confirmPassword){
            return toast.error('Passwords do not match');
        }
        setLoading(true);
        try {
            const response = await register(name, email, password);
            console.log("response",response?.status);
            if (response?.status) {
                dispatch(setUserInfo(response?.user));
                localStorage.setItem("todoToken", response?.token);
                toast.success(response?.message);
                navigate('/');
                setLoading(false);
            } else {
                toast.error(response?.message);
                setLoading(false);
            }
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    }

    const handleGoogleLoginSuccess = async (tokenResponse) => {

        const accessToken = tokenResponse.access_token;

        try {
            const response = await registerGoogle(accessToken);
            console.log(response);
            if (response?.status) {
                dispatch(setUserInfo(response?.user));
                localStorage.setItem("todoToken", response?.token);
                toast.success(response?.message);
                navigate('/');
            } else {
                toast.error(response?.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.message);
        }
    }

    const login = useGoogleLogin({onSuccess: handleGoogleLoginSuccess});


    return (
        <div className="flex flex-col justify-center items-center w-full h-[100vh] bg-[#282D2D] px-5">
            <div className="bg-yellow-400 text-black px-4 py-3 rounded mb-4 max-w-3xl text-center">
                <strong>Notice:</strong> The server may take up to 60 seconds to respond for the first time, as we are using a free service.
            </div>

            <div
                className={`xl:max-w-3xl ${"bg-black"
                    }  w-full p-5 sm:p-10 rounded-md`}
            >
                <h1
                    className={`text-center text-xl sm:text-3xl font-semibold ${"text-white"
                        }`}
                >
                    Register for a free account
                </h1>
                <div className="w-full mt-8">
                    <div className="mx-auto max-w-xs sm:max-w-md md:max-w-lg flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                className={`w-full px-5 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none  focus:border-2  focus:outline ${"bg-[#302E30] text-white focus:border-white"
                                    }`}
                                type="text"
                                placeholder="Your Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <input
                            className={`w-full px-5 py-3 rounded-lg  font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2  focus:outline ${"bg-[#302E30] text-white focus:border-white"
                                }`}
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="relative w-full">
                            <input
                                className={`w-full px-5 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2 focus:outline ${"bg-[#302E30] text-white focus:border-white"
                                    }`}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <div className="relative w-full">
                            <input
                                className={`w-full px-5 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2 focus:outline ${"bg-[#302E30] text-white focus:border-white"
                                    }`}
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <button disabled={loading} data-testid="register-button" className={`mt-5 tracking-wide font-semibold ${!loading ? "bg-[#E9522C]" : "bg-[#E9522C]/30"} text-gray-100 w-full py-4 rounded-lg ${!loading ? "hover:bg-[#E9522C]/90" :"hover:bg-[#E9522C]/30"} transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}>
                            <span className="ml-3" onClick={handleRegister}>Register</span>
                        </button>
                        <p className="text-center">Or</p>
                        <button className="mt-1 tracking-wide font-semibold bg-[#E9522C] text-gray-100 w-full py-4 rounded-lg hover:bg-[#E9522C]/90 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                            <span className="ml-3" onClick={login}>Signup using Google</span>
                        </button>
                        <p className="mt-6 text-xs text-gray-600 text-center">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-[#E9522C] hover:text-gray-300"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            {/* <ToastContainer /> */}
        </div>
    );
};
export default Signup;
