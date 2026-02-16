import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import formReducer from '../features/form/formSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        forms: formReducer,
    },
});
