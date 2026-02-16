import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    forms: [],
    assignedForms: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

// Create Form
export const createForm = createAsyncThunk(
    'forms/create',
    async (formData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post('http://localhost:5000/api/forms', formData, config);
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

// Get My Created Forms
export const getMyForms = createAsyncThunk(
    'forms/getMyForms',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get('http://localhost:5000/api/forms/my-forms', config);
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

// Get Assigned Forms (Student)
export const getAssignedForms = createAsyncThunk(
    'forms/getAssignedForms',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get('http://localhost:5000/api/forms/assigned', config);
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

// Submit Form
export const submitForm = createAsyncThunk(
    'forms/submit',
    async ({ formId, answers }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(`http://localhost:5000/api/forms/${formId}/submit`, { answers }, config);
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

export const formSlice = createSlice({
    name: 'forms',
    initialState,
    reducers: {
        resetForms: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createForm.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createForm.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.forms.push(action.payload);
            })
            .addCase(createForm.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get My Forms
            .addCase(getMyForms.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyForms.fulfilled, (state, action) => {
                state.isLoading = false;
                state.forms = action.payload;
            })
            // Get Assigned Forms
            .addCase(getAssignedForms.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAssignedForms.fulfilled, (state, action) => {
                state.isLoading = false;
                state.assignedForms = action.payload;
            })
            // Submit
            .addCase(submitForm.fulfilled, (state, action) => {
                state.isSuccess = true;
                // Optionally flag the form as submitted in local state
            });
    },
});

export const { resetForms } = formSlice.actions;
export default formSlice.reducer;
