import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    users: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

// Add Role to current user
export const addRole = createAsyncThunk(
    'user/addRole',
    async (roleData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post('http://localhost:5000/api/users/role', roleData, config);
            return response.data; // Returns updated roles
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get All Users (Admin)
export const getUsers = createAsyncThunk(
    'user/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get('http://localhost:5000/api/users', config);
            return response.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update Role Status (Admin)
export const updateRoleStatus = createAsyncThunk(
    'user/updateRoleStatus',
    async ({ id, role, status }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(`http://localhost:5000/api/users/${id}/role`, { role, status }, config);
            return response.data; // Returns updated user
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete User (Super Admin)
export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.delete(`http://localhost:5000/api/users/${id}`, config);
            return id; // Return ID to remove from state
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetUser: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // Add Role
            .addCase(addRole.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addRole.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Ideally update auth state with new roles, but for now just success
            })
            .addCase(addRole.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Users
            .addCase(getUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update Status
            .addCase(updateRoleStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users = state.users.map((user) =>
                    user._id === action.payload._id ? action.payload : user
                );
            })
            // Delete User
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users = state.users.filter((user) => user._id !== action.payload);
            });
    },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
