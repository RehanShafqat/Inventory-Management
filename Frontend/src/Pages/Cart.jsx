import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartItemQuantity, removeItemFromCart, updateUserRole, orderItems } from '../Redux/cartSlice';
import { fetchUserDetails } from '../Redux/userSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const cart = useSelector(state => state.cart.cart);
    const userId = useSelector(state => state.user.userId);
    const userRole = useSelector(state => state.user.role); // Select the user role from the state


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleQuantityChange = (id, quantity) => {
        dispatch(updateCartItemQuantity({ id, quantity: parseInt(quantity) }));
    };

    const handleRemoveItem = (id) => {
        dispatch(removeItemFromCart({ id }));
    };

    useEffect(() => {
        if (!userId) {
            dispatch(fetchUserDetails());
        }
        dispatch(updateUserRole({ role: userRole }))
    }, [userId, dispatch]);

    const handlePlaceOrder = () => {
        const result = dispatch(orderItems());
        result.then((response) => {
            navigate("/AdminDashboard")
        }).catch((error) => {
            toast.error(error.message);
        })

    }
    return (
        <div>
            <h2 className='text-4xl text-center mt-2'>Cart</h2>
            {!cart && (
                <div className='bg-red-500 w-[20%] mx-auto'>
                    <h1 className='text-xl text-white font-light px-2 py-2 text-center mt-10'>
                        No items in the cart
                    </h1>
                </div>
            )}
            <ul>
                {cart && cart.map(item => (
                    <>
                        <li key={item.id} className="mb-4">
                            <p>{item.name} - ${item.price}</p>
                            <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                className="border border-gray-300 p-1 rounded"
                            />
                            <div>
                                Total: ${item.price * item.quantity}
                            </div>
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="ml-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
                            >
                                Remove
                            </button>
                        </li>

                    </>
                ))}
                <button className='bg-darkModeColor px-4 py-2 text-white ' onClick={handlePlaceOrder}>
                    Place Order
                </button>
            </ul>
            <div className='mt-4'>
                <h3>User ID: {userId}</h3>
                <h3>User Role: {userRole}</h3>
            </div>
        </div>
    );
};

export default Cart;
