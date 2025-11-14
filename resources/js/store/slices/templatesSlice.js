import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchTemplates = createAsyncThunk('templates/fetch', async (params = {}) => {
    const { data } = await api.get('/templates', { params });
    return data;
});

const templatesSlice = createSlice({
    name: 'templates',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTemplates.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTemplates.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.data ?? action.payload;
            })
            .addCase(fetchTemplates.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default templatesSlice.reducer;
