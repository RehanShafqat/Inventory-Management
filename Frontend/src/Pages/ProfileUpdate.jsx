import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { changeProfile, fetchUserDetails } from '../Redux/userSlice';
const ProfileUpdate = () => {
    const { userId, email, username, imageURL, role } = useSelector((state) => state.user);
    const [bio, setBio] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!userId) {
            dispatch(fetchUserDetails());
        }
    })


    const handleSave = () => {
        console.log('Saving profile...');
        // Implement save logic here, e.g., dispatch an action to update user profile
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
    };

    const handleCancel = () => {
        setSelectedImage(null);
    };

    const uploadImageToCloudinary = async () => {
        try {
            if (selectedImage) {
                const formData = new FormData();
                formData.append('file', selectedImage);
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
                // console.log(data.url);
                return data.url;
            }
            return null;
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            return null;
        }
    };

    const handleUpload = async () => {
        const toastId = toast.loading("Updating your profile...");
        try {
            const uploadedImageUrl = await uploadImageToCloudinary();
            console.log(uploadedImageUrl);

            const resultAction = await dispatch(changeProfile(uploadedImageUrl, toastId));

            const result = resultAction.payload;

            toast.success("Profile updated", {
                id: toastId,
            });
            window.location.reload();
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error("Failed to update profile. Please try again.", {
                id: toastId,
            });
        }
    };


    return (
        <div className="bg-bgWhite w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
            {
                console.log(userId)
            }
            <main className="w-full mx-auto min-h-screen py-1 md:w-2/3 lg:w-3/4">
                <div className="p-2 md:p-4 flex items-center justify-center">
                    <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                        <h2 className="pl-6 text-2xl font-bold sm:text-xl">Profile View</h2>
                        <div className="grid max-w-2xl mx-auto mt-8">
                            <div className="flex flex-col items-center space-y-5 sm:space-y-0">
                                {selectedImage ? (
                                    <img
                                        className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-darkModeColor"
                                        src={URL.createObjectURL(selectedImage)}
                                        alt="Selected avatar"
                                    />
                                ) : (
                                    <img
                                        className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-darkModeColor"
                                        src={imageURL} // Use the current profile image URL as default
                                        alt="Bordered avatar"
                                    />
                                )}
                                <div className="space-y-5 ml-2">
                                    {selectedImage ? (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handleUpload}
                                                className="py-2 px-7 text-base font-medium text-white bg-darkModeColor rounded-lg border border-indigo-200 hover:bg-black"
                                            >
                                                Upload
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="py-2 px-7 text-base font-medium text-white bg-red-500 rounded-lg border border-indigo-200 hover:bg-red-600"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <input
                                                type="file"
                                                id="profileImage"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                            <label
                                                htmlFor="profileImage"
                                                className="py-2 px-7 mt-10 text-base font-medium text-white focus:outline-none bg-darkModeColor rounded-lg border border-indigo-200 hover:bg-black cursor-pointer"
                                            >
                                                Change picture
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                                <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                    <div className="w-full">
                                        <label htmlFor="username" className="block mb-2 text-sm font-medium  dark:text-white">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            className=" border border-black  bg-white  text-sm rounded-lg block w-full p-2.5"
                                            value={username}
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="mb-2 sm:mb-6">
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium  dark:text-white">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className=" border border-black  bg-white  text-sm rounded-lg block w-full p-2.5"
                                        value={email}
                                        disabled
                                    />
                                </div>

                                <div className="mb-2 sm:mb-6">
                                    <label htmlFor="role" className="block mb-2 text-sm font-medium  dark:text-white">
                                        Role
                                    </label>
                                    <input
                                        type="text"
                                        id="role"
                                        className=" border border-black bg-white   text-sm rounded-lg block w-full p-2.5"
                                        value={role}
                                        disabled
                                    />
                                </div>
                                <div className="mb-2 sm:mb-6">
                                    <label htmlFor="role" className="block mb-2 text-sm font-medium  dark:text-white">
                                        User id
                                    </label>
                                    <input
                                        type="text"
                                        id="role"
                                        className=" border border-black bg-white   text-sm rounded-lg block w-full p-2.5"
                                        value={userId}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfileUpdate;
