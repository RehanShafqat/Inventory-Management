import { useState } from 'react'
import toast from 'react-hot-toast';
import bg from "../assets/bg.jpg"

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Sending Email...", {
            style: {
                minWidth: '240px',
                minHeight: '40px',
                fontSize: "18px",
                fontWeight: "bolder",
                border: '1px solid #713200',
            },
        });
        try {
            const response = await fetch("http://localhost:5000/api/version1/user/forgotPassword/", {
                method: 'POST',
                body: JSON.stringify({ email: email }),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include"
            });
            if (!response.ok) {
                toast.error("Server error", {
                    id: toastId
                })
            }
            const data = await response.json();
            if (data.success == true) {
                toast.success("Email sent successfully", {
                    id: toastId
                })
            }
            if (data.success == false) {
                toast.error(data.message, {
                    id: toastId
                })
            }
            console.log(data);
        }

        catch (error) {
            console.error('Error:', error.message);
        }


    };
    return (
        <>
            <div className="h-[100vh] flex justify-center items-center bg-gray-100 bg-no-repeat bg-cover bg-center " style={{ backgroundImage: `url(${bg})` }}  >

                <div className=' w-full h-full backdrop-blur-sm  top-0 left-0 right-0 absolute  '>
                    <div className="bg-white p-8 rounded  shadow-md w-[100%] sm:w-[35%] absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 ">
                        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="mt-1 h-8 border-none outline-none block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                            >
                                Send Reset Email
                            </button>
                        </form>
                    </div>
                </div>




            </div>
        </>
    )
}

export default ForgotPassword
