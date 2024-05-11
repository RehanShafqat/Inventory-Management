

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../assets/Logo.png";
import { gsap } from "gsap"



import "../assets/App.css"
const Login = () => {
    const navigate = useNavigate();
    const textRef = useRef(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isInvalid, setIsInvalid] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastID = toast.loading("Signing in....", {
            style: {
                minWidth: '240px',
                minHeight: '40px',
                fontSize: "18px",
                fontWeight: "bolder",
                border: '1px solid #713200',
            },
        });
        try {
            const response = await fetch("http://localhost:5000/api/version1/user/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();
            console.log(data);

            if (data.success === 'true') {
                toast.success("Login Successful", {
                    id: toastID,
                });
                navigate("/home");
            } else {
                toast.error(data.message, {
                    id: toastID,
                });
                setIsInvalid(data.message);
            }
        } catch (error) {
            toast.error(error.message, {
                id: toastID,
            });
            console.error('Error:', error);
        }
    };


    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="flex justify-center h-screen">
                <div className="hidden bg-cover lg:block lg:w-2/3"
                    style={{ backgroundImage: 'url(https://img.freepik.com/free-photo/large-group-crates-inside-distribution-warehouse-generated-by-ai_188544-28001.jpg?t=st=1715362724~exp=1715366324~hmac=b0fc7343a72430a70e922539c8eff63032863e9b96a2fa62316021a2446ca87c&w=1380)' }} >
                    <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40 ">
                        <div >
                            <h2 className="text-2xl text-white font-bold sm:text-6xl ">Inventory Management System</h2>
                            <p className="max-w-xl mt-3 text-gray-300  ">
                                Transform Your Inventory Management. Our intuitive platform empowers you to efficiently organize, track, and optimize your inventory.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center w-full max-w-lg px-6 mx-auto lg:w-2/6">
                    <div className="flex-1">
                        <div className="text-center">
                            <div className="flex justify-center mx-auto">
                                <img className="w-auto h-10 sm:h-32" src={Logo} alt="" />
                            </div>
                            <p className="mt-3 text-gray-500 dark:text-gray-300">Sign in to access your account</p>
                        </div>
                        <div className="mt-8">
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="example@example.com"
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mt-6">
                                    <div className="flex justify-between mb-2">
                                        <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-200">Password</label>
                                        <Link to={"/forgot"} className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline">Forgot password?</Link>
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Your Password"
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>
                            <p className="mt-6 text-sm text-center text-gray-400">Don't have an account yet? <Link to={"/register"} className="text-blue-500 focus:outline-none focus:underline hover:underline">Sign up</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

