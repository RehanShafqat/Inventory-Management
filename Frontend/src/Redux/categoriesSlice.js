import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
    try {
        const response = await fetch('http://localhost:5000/api/version1/inventory/getAllCategories/');
        const data = await response.json();
        return data.result;
    } catch (error) {
        throw new Error('Failed to fetch categories');
    }
});

    const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});



export default categorySlice.reducer;
