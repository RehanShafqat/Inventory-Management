import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
export const orderItems = () => {
    return async (dispatch, getState) => {
        const toastId = toast.loading("Placing Order to respective suppliers ... ")
        const { role, cart } = getState().cart;
        const userId = getState().user.userId; // assuming you have the userId in the user slice

        if (role === 'admin') {
            const products = cart.reduce((acc, item) => {
                acc[item.id] = item.quantity;
                return acc;
            }, {});

            const orderData = {
                user_id: userId,
                products: products
            };
            console.log(orderData);
            try {
                const response = await fetch('http://localhost:5000/api/version1/inventory/suplier/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify(orderData)
                });

                const result = await response.json();
                if (result.success === true) {
                    toast.success("Order placed successfully", {
                        id: toastId
                    })
                }
                else {
                    toast.error(result.message, {
                        id: toastId
                    })
                }
            } catch (error) {
                toast.error(error.message, {
                    id: toastId
                })
            }
        } else if (role === 'customer') {
            console.log('customer called');
        }
    };
};






const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: null,
        role: null,
    },
    reducers: {
        addItemToCart: (state, action) => {
            console.log("hello my love");
            const { id, name, price, quantity } = action.payload;
            const existingItem = state.cart && state.cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                if (!state.cart) {
                    state.cart = [];
                }
                state.cart.push({ id, name, price, quantity });
            }
        },
        updateCartItemQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cart && state.cart.find(item => item.id === id);
            if (item) {
                item.quantity = quantity;
            }
        },
        removeItemFromCart: (state, action) => {
            state.cart = state.cart.filter(item => item.id !== action.payload.id);
        },
        clearCart: (state) => {
            state.cart = null;
        },
        updateUserRole: (state, action) => {
            state.role = action.payload.role;  // Add an action to update userRole
        }
    },
});

export const { addItemToCart, updateCartItemQuantity, removeItemFromCart, clearCart, updateUserRole } = cartSlice.actions;
export default cartSlice.reducer;
