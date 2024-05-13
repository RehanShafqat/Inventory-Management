


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';


// Create an asynchronous thunk to fetch orders from the API
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
    try {
        // Make the API request
        const response = await fetch('http://localhost:5000/api/version1/inventory/getAllCustomerOrders/', {
            method: "GET",
            credentials: 'include'
        });
        const data = await response.json();
        console.log(data);
        return data.results;
    } catch (error) {
        throw new Error('Failed to fetch orders');
    }
});
export const updateCustomerOrder = createAsyncThunk(
    'orders/updateCustomerOrder',
    async (orderId, thunkAPI) => {
        try {
            // Make the API request
            const response = await fetch('http://localhost:5000/api/version1/inventory/customer/updateOrder', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_id: orderId,
                    status: "delivered",
                }),
            });
            const data = await response.json();
            console.log(data);
            return data; // Return any relevant data from the API response
        } catch (error) {
            throw new Error('Failed to update order');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.error = null;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Export the asynchronous thunk and reducer
export default orderSlice.reducer;

