import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../assets/Logo.png";
import { useNavigate } from 'react-router-dom';
import bg from "../assets/bg.jpg"


const Registration = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();




    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

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

    const handleRemoveImage = () => {
        setImageUrl(null); // Clear the imageUrl state to remove the displayed image
        setImageFile(null); // Clear the imageFile state to allow selecting a new image
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
                minWidth: '240px',
                minHeight: '40px',
                fontSize: "18px",
                fontWeight: "bolder",
                border: '1px solid #713200',
            },
        });

        try {
            let imageUrl = await uploadImageToCloudinary();
            if (!imageFile) {
                imageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
            }
            const formDataWithImage = {
                ...formData,
                image_URL: imageUrl
            };
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formDataWithImage),
                credentials: 'include'
            };

            const response = await fetch('http://localhost:5000/api/version1/user/customer/register', requestOptions);
            const data = await response.json();
            if (!response.ok) {
                toast.error("Error resetting your password");
            }


            if (data && data.RESULT) {
                setTimeout(() => {
                    toast.success("Registration Successful", {
                        id: toastID,
                    });
                    navigate("/login")
                }, 2000)
            } else {
                toast.error(data.message || "Registration failed", {
                    id: toastID,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Registration failed. Please try again later.", {
                id: toastID,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleUploading();
    };




    return (
        <div className="h-[100vh] flex justify-center items-center bg-gray-100 bg-no-repeat bg-cover bg-center " style={{ backgroundImage: `url(${bg})` }}  >

            <div className='absolute w-full h-full top-0 left-0 right-0 backdrop-blur-sm'>
                <div className="max-w-md w-full h-full  sm:h-fit p-6 bg-white sm:rounded-lg shadow-lg absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                    <div className="text-center flex flex-col items-center">
                        <img className="w-auto h-24 mb-2" src={Logo} alt="Logo" />
                        <h1 className="text-2xl font-semibold text-black mt-2">Sign up</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-5" encType="multipart/form-data">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2  shadow-sm placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 "
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2  shadow-sm placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2  shadow-sm placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                required
                            />
                        </div>
                        <div className="mt-4 ">
                            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">Profile Image</label>
                            <input
                                type="file"
                                id="profileImage"
                                name="profileImage"
                                onChange={handleImageChange}
                                className="mt-1 block w-full px-3 py-2 border border-b-0 shadow-sm focus:outline-none focus:border-blue-400"
                                accept="image/*"
                            />
                        </div>
                        {imageUrl && (
                            <div className="flex flex-col mt-0  border border-t-0   items-center">
                                <img
                                    src={imageUrl}
                                    alt="Selected Image"
                                    className="w-[80%] h-20 mr-4 rounded-md "
                                    style={{ objectFit: 'contain' }}
                                />
                                <button
                                    type="button"
                                    className="  mb-2 text-white px-6 py-1 transition-colors rounded-md bg-red-500 hover:bg-red-700 focus:outline-none"
                                    onClick={handleRemoveImage}
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                        <button
                            type="submit"
                            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300"
                        >
                            Sign Up
                        </button>
                    </form>
                    <p className="mt-4 text-sm text-gray-600 text-center">
                        Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>




        </div>
    );
};

export default Registration;
