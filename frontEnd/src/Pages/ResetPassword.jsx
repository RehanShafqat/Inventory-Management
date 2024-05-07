import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
        try {
            const response = await fetch("http://localhost:5000/api/version1/user/resetPassword/", {
                method: 'POST',
                body: JSON.stringify({ token: token, password: password }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();
            console.log(data);
            if (data.success === true) {
                setTimeout(() => {
                    navigate("/login");
                }, 3000)
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-purple bg-purple-500">
            {isValidToken ? (
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl text-purple-dark mb-6 text-purple-700 font-bold">Reset Your Password</h2>
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
                            className="w-full bg-purple text-white py-2 rounded-md hover:bg-purple-dark focus:outline-none bg-purple-500"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            ) : (
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl text-purple-dark mb-6 text-purple-700 font-bold">
                        Access Denied
                    </h1>
                    <p className="text-red-500 text-sm mb-4">Invalid or expired token.</p>
                </div>
            )}
        </div>
    );
};

export default ResetPassword;
