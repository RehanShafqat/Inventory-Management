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

// Async thunk action to fetch user details using JWT from cookies
export const fetchUserDetails = createAsyncThunk(
    'user/fetchDetails',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:5000/api/version1/user/details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {

                return data.result;
            } else {
                return rejectWithValue(data); // Fetch failed
            }
        } catch (error) {
            throw new Error('Fetching user details failed'); // Network error or other exception
        }
    }
);
export const changeProfile = createAsyncThunk(
    'user/changeProfile',
    async (image_URL, thunkAPI) => {
        try {
            const response = await fetch('http://localhost:5000/api/version1/user/change/profileImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image_URL: image_URL,
                    user_id: thunkAPI.getState().user.userId
                }),
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {
                return data.message;
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (error) {
            throw new Error('Image upload failed');
        }
    }
);
export const fetchUserCount = createAsyncThunk(
    'user/fetchUserCount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:5000/api/version1/user/getAllUsers/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {
                return data.users;
            } else {
                return rejectWithValue(data); // Fetch failed
            }
        } catch (error) {
            throw new Error('Fetching user count failed'); // Network error or other exception
        }
    }
);







const userSlice = createSlice({
    name: 'user',
    initialState: {
        userId: null,
        email: '',
        username: '',
        imageURL: '',
        role: '',
        loading: false,
        error: null,
        success: null,
        userCount: null
    },
    reducers: {
        // Reducer to reset user state
        resetUserState(state) {
            state.userId = null;
            state.email = '';
            state.username = '';
            state.imageURL = '';
            state.role = '';
            state.loading = false;
            state.error = null;
            state.success = null;
        },
        updateUserState(state, action) {
            state.userId = action.payload.user_id;
            state.email = action.payload.email;
            state.username = action.payload.username;
            state.imageURL = action.payload.image_URL;
            state.role = action.payload.role;
        }
    },
    extraReducers: (builder) => {
        builder
            // For logging in
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userId = action.payload.user.user_id;
                state.email = action.payload.user.email;
                state.username = action.payload.user.username;
                state.imageURL = action.payload.user.image_URL;

                state.role = action.payload.user.role;
                state.success = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload.message : 'Login failed';
            })
            // For fetching user details
            .addCase(fetchUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.userId = action.payload.user_id;
                state.email = action.payload.email;
                state.username = action.payload.username;
                state.imageURL = action.payload.image_URL;
                state.role = action.payload.role;
                state.error = null;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload.message : 'Fetching user details failed';
            })
            .addCase(fetchUserCount.fulfilled, (state, action) => {
                state.userCount = action.payload;
            })
    },
});

// Export actions and reducer
export const { resetUserState, updateUserState } = userSlice.actions;
export default userSlice.reducer;
