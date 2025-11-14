import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/client';

const tokenFromStorage = localStorage.getItem('remindly_token');

export const registerUser = createAsyncThunk('auth/register', async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
});

export const loginUser = createAsyncThunk('auth/login', async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    return data;
});

export const fetchProfile = createAsyncThunk('auth/profile', async () => {
    const { data } = await api.get('/me');
    return data.user;
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await api.post('/logout');
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: tokenFromStorage,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
                localStorage.setItem('remindly_token', action.payload.token);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
                localStorage.setItem('remindly_token', action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.token = null;
                localStorage.removeItem('remindly_token');
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.status = 'idle';
                localStorage.removeItem('remindly_token');
            });
    },
});

export default authSlice.reducer;
