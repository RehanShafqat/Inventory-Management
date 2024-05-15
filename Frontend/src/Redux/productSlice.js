// slices/productSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch all products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    try {
        const response = await fetch('http://localhost:5000/api/version1/inventory/getAllProducts/', {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        console.log(data);
        return data.products;
    } catch (error) {
        throw error;
    }
});

// Create productSlice
const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log(action.payload);
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});
// Export actions and reducer
export default productSlice.reducer;
