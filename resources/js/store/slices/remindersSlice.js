import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchReminders = createAsyncThunk('reminders/fetch', async (params = {}) => {
    const { data } = await api.get('/reminders', { params });
    return data;
});

export const createReminder = createAsyncThunk('reminders/create', async (payload) => {
    const { data } = await api.post('/reminders', payload);
    return data;
});

const remindersSlice = createSlice({
    name: 'reminders',
    initialState: {
        items: [],
        pagination: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReminders.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchReminders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.data ?? action.payload;
                state.pagination = action.payload.meta ?? {};
            })
            .addCase(fetchReminders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createReminder.fulfilled, (state, action) => {
                state.items = [action.payload, ...state.items];
            });
    },
});

export default remindersSlice.reducer;
