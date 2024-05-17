import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../Redux/orderSlice';
import OrdersList from '../Components/OrdersList';
import { fetchUserDetails } from '../Redux/userSlice';
import ErrorPage from './ErrorPage';

const Orders = () => {

    const orders = useSelector((state) => state.order.orders);
    const role = useSelector((state) => state.user.role)
    const dispatch = useDispatch();


    useEffect(() => {
        if (!orders) {
            dispatch(fetchOrders());
        }
        if (!role) {
            dispatch(fetchUserDetails());
        }
    }, [orders, role, dispatch])

    return (
        <>
            {
                role && role === 'admin' || role === 'manager' ? (
                    <>
                        <div className=''>
                            <div className='overflow-x-auto mx-auto w-[90%] mt-10 max-h-[60vh] overflow-y-auto border-b-8 ' style={{ scrollbarWidth: "none" }} >
                                <h1 className="text-2xl font-bold mb-4">Admin Orders List</h1>
                                <table className="min-w-full  divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders && orders
                                            .filter(order => order.role === "admin")
                                            .map((order, key) => (
                                                <tr key={key}>
                                                    <td className="px-6 py-4 whitespace-nowrap">{key + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{order.user_name.replace(/^\w/, (c) => c.toUpperCase())}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={` px-2 py-1 rounded-full ${order.status === "pending" ? "text-red-500" : "text-green-500"} `}>
                                                            {order.status.replace(/^\w/, (c) => c.toUpperCase())}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className=''>
                            <div className='mx-auto w-[90%] border-b-8 mb-10 '>
                                <OrdersList />
                            </div>
                        </div>


                    </>
                ) : (
                    <ErrorPage />
                )
            }

        </>




    )
}

export default Orders

