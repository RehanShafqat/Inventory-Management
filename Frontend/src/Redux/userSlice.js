import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

// Async thunk action to handle user login
export const loginUser = createAsyncThunk(
    'user/login',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:5000/api/version1/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data);
                return data;
            } else {
                return rejectWithValue(data); // Login failed
            }
        } catch (error) {
            throw new Error('Login failed'); // Network error or other exception
        }
    }
);
const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: '',
        userId: null,
        email: '',
        role: '',
        loading: false,
        error: null,
        success: null
    },
    reducers: {
        // Reducer to reset user state
        resetUserState(state) {
            state.username = '';
            state.userId = null;
            state.email = '';
            state.role = '';
            state.loading = false;
            state.error = null;
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            //for logging in 
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.username = action.payload.user.username;
                state.userId = action.payload.user.id;
                state.email = action.payload.user.email;
                state.role = action.payload.user.role;
                state.success = action.payload.success;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload.message : 'Login failed';
            })
    },
});

// Export actions and reducer
export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
