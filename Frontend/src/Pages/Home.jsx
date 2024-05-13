import React from 'react';
import { useNavigate } from 'react-router-dom';
import LineChart from '../Components/LineChart';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/version1/user/logout/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                navigate('/login');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1 className="text-4xl text-center">THIS IS HOME PAGE</h1>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md ml-4" onClick={handleLogout}>
                Logout
            </button>
            <LineChart />
        </div>
    );
};

export default Home;
