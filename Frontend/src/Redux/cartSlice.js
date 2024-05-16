import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

export const orderItems = () => {
    return async (dispatch, getState) => {
        const toastId = toast.loading("Placing Order to respective suppliers ... ");
        const { role, cart } = getState().cart;
        const userId = getState().user.userId;
        let url = "";
        if (role === "admin" || role === "manager") {
            url = "http://localhost:5000/api/version1/inventory/suplier/order"
        }
        else if (role === "customer") {
            url = "http://localhost:5000/api/version1/inventory/customer/order"
        }

        //making api object for request
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
            const response = await fetch(`${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            console.log(result);
            if (result.success === true) {
                toast.success("Order placed successfully", {
                    id: toastId
                });
            } else {
                toast.error(result.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error.message, {
                id: toastId
            });
        }





    };
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: [],
        role: null,
    },
    reducers: {
        addItemToCart: (state, action) => {
            const { id, name, price, quantity, url } = action.payload;
            const existingItem = state.cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.cart.push({ id, name, price, quantity, url });
            }
        },
        updateCartItemQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cart.find(item => item.id === id);
            if (item) {
                item.quantity = quantity;
            }
        },
        removeItemFromCart: (state, action) => {
            state.cart = state.cart.filter(item => item.id !== action.payload.id);
        },
        clearCart: (state) => {
            state.cart = [];
        },
        updateUserRole: (state, action) => {
            state.role = action.payload.role;
        },
    },
});

export const { addItemToCart, updateCartItemQuantity, removeItemFromCart, clearCart, updateUserRole } = cartSlice.actions;
export default cartSlice.reducer;
