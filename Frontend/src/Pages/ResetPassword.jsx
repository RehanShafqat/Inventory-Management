import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import bg from "../assets/bg.jpg"

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [isValidToken, setIsValidToken] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEqual, setIsEqual] = useState(true); // State to track password equality

    // Check token validity on component mount
    useEffect(() => {
        const checkValidToken = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/version1/user/isTokenValid/", {
                    method: 'POST',
                    body: JSON.stringify({ token: token }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const data = await response.json();
                setIsValidToken(data.success); // Update validity state based on API response
            } catch (error) {
                console.error('Error:', error.message);
                setIsValidToken(false); // Set validity to false on error
            }
        };

        checkValidToken();
    }, []);



    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if passwords match
        if (password !== confirmPassword) {
            setIsEqual(false);
            return;
        }




        const toastID = toast.loading("Loding...");
        try {
            const response = await fetch("http://localhost:5000/api/version1/user/resetPassword/", {
                method: 'POST',
                body: JSON.stringify({ token: token, password: password }),
                headers: {
                    'Content-Type': 'application/json'
                },
            }); const data = await response.json();
            if (data.success === true) {
                setTimeout(() => {
                    toast.success("Password reset succesfull", {
                        id: toastID,
                    })
                    navigate("/login");
                }, 2000)
            }
            if (data.success == false) {
                toast.error(data.message, {
                    id: toastID,
                })
            }
        } catch (error) {
            toast.error(error.message, {
                id: toastID,
            })
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="h-[100vh] flex justify-center items-center bg-gray-100 bg-no-repeat bg-cover bg-center " style={{ backgroundImage: `url(${bg})` }}>
            <div className="w-full h-full backdrop-blur-sm  top-0 left-0 right-0 absolute ">
                {isValidToken ? (
                    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg  absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                        <h2 className="text-2xl text-purple-dark mb-6 font-bold">Reset Your Password</h2>
                        {!isEqual && (
                            <p className="text-red-500 text-sm mb-4">Passwords do not match. Please try again.</p>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-8 outline-none border-none"
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-8 outline-none border-none"
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                            >
                                Reset Password
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg  absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                        <h1 className="text-2xl text-purple-dark mb-6 text-red-500 font-bold">
                            Access Denied..!
                        </h1>
                        <p className=" text-sm mb-4">Invalid or expired token.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
