import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

// Define the initial state

// Create an asynchronous thunk to fetch supplier details from the API using fetch
export const fetchSuppliers = createAsyncThunk('supplier/fetchSuppliers', async (_, thunkAPI) => {
    try {
        // Make a fetch request to the API endpoint (replace '/api/suppliers' with your actual API endpoint)
        const response = await fetch('http://localhost:5000/api/version1/inventory/getSupplierDetails/', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json(); // Parse the JSON response
        return data.suppliers;
    } catch (error) {
        console.log(error.message);
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const addSupplier = createAsyncThunk('supplier/addSupplier', async (formData, thunkAPI) => {
    const toastId = toast.loading("Adding supplier ... ");
    try {
        const response = await fetch('http://localhost:5000/api/version1/inventory/addSupplier', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });

        const Data = await response.json();
        if (response.ok) {
            toast.success(Data.message, {
                id: toastId,
            });
            return Data;
        } else {
            toast.error(`Error: ${Data.message}`, {
                id: toastId,
            });
            return thunkAPI.rejectWithValue(Data.message);
        }
    } catch (error) {
        toast.error(`Error: ${error.message}`, {
            id: toastId,
        });
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Create a slice for managing suppliers
const supplierSlice = createSlice({
    name: 'supplier',
    initialState: {
        suppliers: null,
        loading: null,
        error: null,
        success: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuppliers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSuppliers.fulfilled, (state, action) => {
                state.loading = false;
                state.suppliers = action.payload;
                state.error = null;
                state.success = true;
            })
            .addCase(fetchSuppliers.rejected, (state, action) => {
                state.error = action.payload || action.error.message;
                state.loading = false;
                state.success = false;
            })
            .addCase(addSupplier.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSupplier.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = true;
            })
            .addCase(addSupplier.rejected, (state, action) => {
                state.error = action.payload || action.error.message;
                state.loading = false;
                state.success = false;
            });
    },
});

// Export the asynchronous thunk and reducer
export default supplierSlice.reducer;
