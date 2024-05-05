import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        admin_id: '',
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
                minWidth: '240px', // Set minimum width
                minHeight: '40px',
                fontSize: "18px",
                fontWeight: "bolder",
                border: '1px solid #713200',
                // Set minimum height
            },
        });
        try {
            const response = await fetch("http://localhost:5000/api/version1/user/admin/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();
            console.log(data);
            setTimeout(() => {
                if (data.success == 'true') {
                    toast.success("Login Succesfull", {
                        id: toastID,
                    });
                    navigate("/home");
                }
            }, [3000])
            setTimeout(() => {
                if (data.success == 'false') {
                    toast.error(data.message, {
                        id: toastID,
                    });
                    setIsInvalid(data.message);
                }
            }, [3000])



        } catch (error) {
            toast.error(error.message, {
                id: toastID,
            });
            console.error('Error:', error);

        }


    };

    return (
        <div className="py-16 ">
            <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-xl lg:max-w-7xl  ">
                <div className="hidden lg:block lg:w-[40%] bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616401769134-9e7d672874a8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", }}>
                </div>
                <div className="w-full p-8 lg:w-[60%] h-[80vh]">
                    <h2 className="text-2xl font-semibold  text-center text-indigo-700">Inventory Management System</h2>

                    <div className="mt-4 flex items-center justify-between mb-10">
                        <span className="border-b w-1/5 lg:w-1/4"></span>
                        <p href="#" className="text-xs text-center text-gray-500 uppercase "> login with Admin_id</p>
                        <span className="border-b w-1/5 lg:w-1/4"></span>
                    </div>
                    <form className="mt-4" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>

                            <input className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Password</label>

                            <input className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="admin_id" className="block text-sm font-medium text-gray-600 mb-1">Admin ID</label>
                            <input
                                type="text"
                                id="admin_id"
                                name="admin_id"
                                value={formData.admin_id}
                                onChange={handleChange}
                                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
                        >
                            Login
                        </button>
                    </form>
                    {
                        isInvalid ? (
                            <div className='text-xl bg-red-700 rounded-md text-white py-3 mt-5 w-full text-center'>
                                <h1>
                                    Invalid credentials
                                </h1>

                            </div>
                        ) : null
                    }
                    <div className="mt-4 flex items-center justify-between">
                        <span className="border-b w-1/5 md:w-[35%]"></span>
                        <Link to={"/register"} className="text-xs text-gray-500 uppercase">or sign up</Link>
                        <span className="border-b w-1/5 md:w-[35%]"></span>
                    </div>



                </div>
            </div>
        </div>
    );
};

export default Login;
