import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
const Registration = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [insertId, setInsertId] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);

        // Generate a temporary URL for the selected image
        setImageUrl(URL.createObjectURL(file));
    };

    const uploadImageToCloudinary = async () => {
        try {
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('upload_preset', 'Inventory_management');
                const cloudName = 'driuxeclu';

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );
                const data = await response.json();
                console.log(data.url);
                return data.url;
            }
            return null;
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            return null;
        }
    };

    const handleUploading = async () => {

        const toastID = toast.loading("Registering....", {
            style: {
                minWidth: '240px', // Set minimum width
                minHeight: '40px',
                fontSize:"18px",
                fontWeight:"bolder",
                border: '1px solid #713200',
                 // Set minimum height
            },
        });
        try {

            const imageUrl = await uploadImageToCloudinary();
            const formDataWithImage = {
                ...formData,
                imgUrl: imageUrl
            };

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formDataWithImage)
            };

            const response = await fetch('http://localhost:5000/api/version1/user/admin/register', requestOptions);
            const data = await response.json();

            console.log(data);

            if (data && data.RESULT && data.RESULT.insertId) {
                toast.success("Registration Succesfull", {
                    id: toastID,
                });
                setInsertId(data.RESULT.insertId);
            } else {

                toast.error(data.message, {
                    id: toastID,
                });

            }
            return data; // Return the response data
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message, {
                id: toastID,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        handleUploading();

    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
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
                                type="text"
                                placeholder="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            <input
                                className="w-full mt-5 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                className="w-full mt-5 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="w-full mt-5"
                            />
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt="Selected Image"
                                    className="mt-5 rounded-lg shadow-2xl "
                                    style={{ maxWidth: '50%', maxHeight: '200px' }}
                                />
                            )}
                            <button
                                className="mt-5 w-full tracking-wide font-semibold bg-indigo-500 text-gray-100 py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:shadow-outline focus:outline-none"
                                type="submit"
                            >
                                Sign Up
                            </button>
                        </form>
                        {insertId && (
                            <div className='text-xl bg-green-700 rounded-md text-white py-3 mt-5 w-full text-center'>
                                <h1>
                                    Your adminId is <span className='font-bold'>{insertId}</span>
                                </h1>
                            </div>
                        )}
                        <p className="mt-6 text-xs text-gray-600 text-center">
                            Copyright &#169; &nbsp;&nbsp;
                            <a href="#">Terms of Service &nbsp;</a>
                            <a href="#">Privacy Policy</a>
                        </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="border-b w-1/5 md:w-[35%]"></span>
                        <Link to={"/Login"} className="text-xs text-gray-500 uppercase">
                            or sign in
                        </Link>
                        <span className="border-b w-1/5 md:w-[35%]"></span>
                    </div>
                </div>
                <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                    <div
                        className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                        style={{
                            backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
