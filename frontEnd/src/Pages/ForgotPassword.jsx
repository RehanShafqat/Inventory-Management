import { useState } from 'react'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(`Password reset email sent to: ${email}`);

    };
    return (
        <>
            <div className="min-h-screen bg-purple-500 flex justify-center items-center">
                <div className="bg-white p-8 rounded shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-4 text-purple-500">Forgot Password</h2>
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
                            className="w-full  bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                        >
                            Send Reset Email
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword
