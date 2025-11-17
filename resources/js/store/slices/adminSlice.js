import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchAdminOverview = createAsyncThunk('admin/overview', async () => {
    const { data } = await api.get('/admin/overview');
    return data;
});

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        stats: {},
        users: [],
        reminders: [],
        legacy_messages: [],
        payments: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminOverview.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAdminOverview.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.stats = action.payload.stats ?? {};
                state.users = action.payload.users ?? [];
                state.reminders = action.payload.reminders ?? [];
                state.legacy_messages = action.payload.legacy_messages ?? [];
                state.payments = action.payload.payments ?? [];
            })
            .addCase(fetchAdminOverview.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default adminSlice.reducer;
