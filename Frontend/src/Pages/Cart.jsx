import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartItemQuantity, removeItemFromCart, updateUserRole, orderItems } from '../Redux/cartSlice';
import { fetchUserDetails } from '../Redux/userSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
const Cart = () => {
    const cart = useSelector(state => state.cart.cart);
    const userId = useSelector(state => state.user.userId);
    const userRole = useSelector(state => state.user.role);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            dispatch(fetchUserDetails());
        }
        dispatch(updateUserRole({ role: userRole }));
    }, [userId, dispatch]);

    const handleQuantityIncrease = (id, currentQuantity) => {
        dispatch(updateCartItemQuantity({ id, quantity: currentQuantity + 1 }));
    };

    const handleQuantityDecrease = (id, currentQuantity) => {
        if (currentQuantity > 1) {
            dispatch(updateCartItemQuantity({ id, quantity: currentQuantity - 1 }));
        }
    };

    const handleRemoveItem = (id) => {
        dispatch(removeItemFromCart({ id }));
    };

    const handlePlaceOrder = () => {
        const result = dispatch(orderItems());
        result.then((response) => {
            navigate("/AdminDashboard");
        }).catch((error) => {
            toast.error(error.message);
        });
    };

    const calculateSubtotal = (price, quantity) => {
        return price * quantity;
    };
    const calculateTotalAmount = () => {
        let total = 0;
        cart.forEach(item => {
            total += calculateSubtotal(item.price, item.quantity);
        });
        return total;
    };
    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-4xl text-center mb-4">Cart</h2>
            {(!cart || cart.length === 0) && (
                <div className="bg-red-500 w-[20%] mx-auto">
                    <h1 className="text-xl text-white font-light px-2 py-2 text-center mt-10">
                        No items in the cart
                    </h1>
                </div>
            )}

            {cart && cart.length > 0 && (
                <div className="max-w-screen-2xl mx-auto overflow-x-auto">
                    <table className="w-full mt-10">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-2 text-left">Item</th>
                                <th className="px-4 py-2 text-center">Price</th>
                                <th className="px-4 py-2 text-center">Quantity</th>
                                <th className="px-4 py-2 text-center">Subtotal</th>
                                <th className="px-4 py-2 text-center">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="px-4 py-2">
                                        <div className="flex items-center">
                                            <img src={item.url} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-2" />
                                            <span>{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-center">${item.price}</td>
                                    <td className="px-4 py-2 text-center">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => handleQuantityDecrease(item.id, item.quantity)}
                                                className="bg-gray-300 px-2 py-1 rounded-l hover:bg-gray-400"
                                            >
                                                -
                                            </button>
                                            <span className="px-4">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityIncrease(item.id, item.quantity)}
                                                className="bg-gray-300 px-2 py-1 rounded-r hover:bg-gray-400"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-center">${calculateSubtotal(item.price, item.quantity)}</td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className=" text-red-500 px-3 py-1 rounded "
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {cart && cart.length > 0 && (
                <div className="text-right mt-4">
                    <button
                        className="bg-darkModeColor px-4 py-2 text-white"
                        onClick={handlePlaceOrder}
                    >
                        Place Order
                    </button>
                </div>
            )}
            {cart && cart.length > 0 && (
                <div className="text-right mt-4">
                    <h3 className="text-lg">Total Amount: ${calculateTotalAmount()}</h3>
                </div>
            )}
        </div>
    );
};

export default Cart;
