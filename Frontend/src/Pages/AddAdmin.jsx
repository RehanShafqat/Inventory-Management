import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';

const AddAdmin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'admin',
        description: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        // Fetch any additional data if required
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview('');
        const fileInput = document.getElementById('image');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const uploadImageToCloudinary = async () => {
        try {
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('upload_preset', `${import.meta.env.VITE_CLOUD_FOLDER_NAME}`);
                const cloudName = import.meta.env.VITE_CLOUD_NAME;

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );
                const data = await response.json();
                return data.url;
            }
            return null;
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            return null;
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Adding admin ... ");
        var image_url;
        if (imageFile) {
            image_url = await uploadImageToCloudinary();
        }
        const formDataWithImage = { ...formData, image_url };
        console.log(formDataWithImage);
        const response = await fetch('http://localhost:5000/api/version1/user/manager/addAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(formDataWithImage),
        });

        const Data = await response.json();
        if (response.ok) {
            toast.success(Data.message, {
                id: toastId,
            });
            navigate("/adminDashboard");
            console.log(Data);
        } else {
            console.log(Data);
            toast.error(`Error: ${Data.message}`, {
                id: toastId,
            });
        }
    };

    return (
        <div className='min-w-screen min-h-screen bg-bgWhite'>
            <div className='mb-6 sm:w-[95%] flex flex-col mx-auto'>
                <h2 className="text-4xl font-medium mt-4 sm:text-left text-center mx-auto ">Add Admin</h2>
                <span className='mx-auto text-sm text-slate-500'>
                    Add new admin for your system
                </span>
            </div>
            <div className="sm:min-w-[78vw] min-w-screen m-auto p-6 ">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="border mb-10 min-h-[70vh] rounded-lg bg-white">
                        <div className='sm:w-[96%]  mx-auto mt-4'>
                            <h1 className='text-2xl mb-8'>
                                Basic Information
                            </h1>
                            <div className='border rounded-lg h-80   w-[95%] py-3'>
                                <div className='w-[95%] mx-auto'>
                                    <div className="form-group">
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                            className="mt-2 block w-full border p-3 rounded-md outline-none shadow-sm sm:text-sm focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:border-blue-400 border-gray-300"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-8">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="mt-2 block w-full p-3 outline-none shadow-sm sm:text-sm border-gray-300 border rounded-lg focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:border-blue-400"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-8">Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="mt-2 block w-full p-3 outline-none shadow-sm sm:text-sm border-gray-300 border rounded-lg focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:border-blue-400"
                                        />
                                    </div>

                                    <div className=' w-full rounded-lg mt-10  py-3'>
                                        <div className='w-[95%] mx-auto'>
                                            <div className="form-group ">
                                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Admin Image</label>
                                                <input
                                                    type="file"
                                                    id="image"
                                                    name="image"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="py-3  outline-none shadow-sm mt-2 block w-full pl-3 pr-10 text-base border-gray-300 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:border-blue-400 sm:text-sm border rounded-lg"
                                                />
                                                {imagePreview && (
                                                    <div className='ml-1 mt-1 relative'>
                                                        <img src={imagePreview} alt="Selected" className="h-24 w-24 object-fit" />
                                                        <button
                                                            type="button"
                                                            onClick={handleRemoveImage}
                                                            className="text-black absolute top-0 left-[6.4rem]"
                                                        >
                                                            <CloseIcon />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-darkModeColor hover:bg-black text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Add Admin
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAdmin;
