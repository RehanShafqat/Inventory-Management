import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from '../Redux/orderSlice';
import { updateCustomerOrder } from '../Redux/orderSlice';
import toast from 'react-hot-toast';

const OrdersList = () => {
    const orders = useSelector((state) => state.order.orders);
    const { role } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    if (!orders) {
        dispatch(fetchOrders());
    }
    const handleStatusChange = async (orderId) => {
        const confirmed = window.confirm("Are you sure you want to continue?");
        if (confirmed) {
            try {
                console.log(role);
                await dispatch(updateCustomerOrder(orderId));
                window.location.reload();
            } catch (error) {
                console.error('Failed to update order:', error);
                toast.error('Failed to update order');
            }
        }
    };
    return (
        <div className='overflow-x-auto mt-10' >
            <h1 className="text-2xl font-bold mb-4">Orders List</h1>
            <table className="min-w-full  divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {orders && orders
                        .filter(order => order.status === 'pending' && order.role === "customer")
                        .map((order, key) => (
                            <tr key={key}>
                                <td className="px-6 py-4 whitespace-nowrap">{key + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{order.user_name.replace(/^\w/, (c) => c.toUpperCase())}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        className="rounded"
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.order_id)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`text-red-500 px-2 py-1 rounded-full`}>
                                        {order.status.replace(/^\w/, (c) => c.toUpperCase())}
                                    </span>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersList;
