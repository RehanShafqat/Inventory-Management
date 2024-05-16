import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails } from '../Redux/userSlice';
import ErrorPage from './ErrorPage';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const role = useSelector(state => state.user.role);

    useEffect(() => {
        if (!role) {
            dispatch(fetchUserDetails())
        }
    }, [dispatch, role])
    return (
        <div>
            {
                role && role === 'customer' ?
                    (<h1 className="text-4xl text-center mt-12">THIS IS HOME PAGE FOR CUSTOMER </h1>) :
                    (<ErrorPage />)
            }




        </div>
    );
};

export default Home;
