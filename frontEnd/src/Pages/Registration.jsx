import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const Registration = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [insertId, setInsertId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/version1/user/admin/register', formData);
            const data = response.data;
            console.log(data);


            if (data && data.result.insertId) {
                setInsertId(data.result.insertId); // Set insertId from the response
            }
        } catch (error) {
            console.error('Error:', error);

        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 ">
                    <div className='text-indigo-700 font-semibold text-2xl text-center'>
                        Inventory Management System
                    </div>
                    <div className="mt-12 flex flex-col items-center">
                        <h1 className="text-2xl xl:text-3xl font-extrabold">
                            Sign up
                        </h1>
                        <form className="w-full mt-8" onSubmit={handleSubmit}>
                            <input
                                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                type="text" placeholder="Username" name="username" value={formData.username} onChange={handleChange} required
                            />
                            <input
                                className="w-full mt-5 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required
                            />
                            <button
                                className="mt-5 w-full tracking-wide font-semibold bg-indigo-500 text-gray-100 py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:shadow-outline focus:outline-none"
                                type="submit"
                            >
                                Sign Up
                            </button>

                        </form>
                        {
                            insertId ? (
                                <div className='text-xl bg-green-700 rounded-md text-white py-3 mt-5 w-full text-center'>
                                    <h1>
                                        Your adminId is <span className='font-bold'>{insertId}</span>
                                    </h1>

                                </div>
                            ) : null
                        }
                        <p className="mt-6 text-xs  text-gray-600 text-center">
                            Copyright &#169; &nbsp;&nbsp;
                            <a href="#"  >
                                Terms of Service &nbsp;
                            </a>
                            <a href="#"  >
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="border-b w-1/5 md:w-[35%]"></span>
                        <Link to={"/Login"} className="text-xs text-gray-500 uppercase">or sign in</Link>
                        <span className="border-b w-1/5 md:w-[35%]"></span>
                    </div>
                </div>
                <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                    <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')" }}
                    >
                    </div>
                </div>
            </div>
           

        </div>
    );
};

export default Registration;
