import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchLegacyMessages = createAsyncThunk('legacy/fetch', async () => {
    const { data } = await api.get('/legacy/messages');
    return data;
});

export const saveLegacyMessage = createAsyncThunk('legacy/save', async (payload) => {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
    let response;

    if (payload.get && payload.has('id') && payload.get('id')) {
        const id = payload.get('id');
        payload.delete('id');
        response = await api.post(`/legacy/messages/${id}?_method=PUT`, payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    } else if (isFormData) {
        response = await api.post('/legacy/messages', payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    } else if (payload.id) {
        response = await api.put(`/legacy/messages/${payload.id}`, payload);
    } else {
        response = await api.post('/legacy/messages', payload);
    }

    return response.data.data;
});

export const armLegacyMessage = createAsyncThunk('legacy/arm', async (id) => {
    const { data } = await api.post(`/legacy/messages/${id}/arm`);
    return data.data;
});

export const disarmLegacyMessage = createAsyncThunk('legacy/disarm', async (id) => {
    const { data } = await api.post(`/legacy/messages/${id}/disarm`);
    return data.data;
});

export const toggleLegacyPause = createAsyncThunk('legacy/togglePause', async (paused) => {
    const { data } = await api.post('/legacy/toggle-pause', { paused });
    return data;
});

const legacySlice = createSlice({
    name: 'legacy',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        paused: false,
        legacyPausedAt: null,
        summary: {
            drafts: 0,
            armed: 0,
            delivered: 0,
            next_check_in_due_at: null,
            upcoming: [],
        },
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLegacyMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLegacyMessages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.data ?? [];
                state.paused = action.payload.paused ?? false;
                state.legacyPausedAt = action.payload.legacy_paused_at ?? null;
                state.summary = action.payload.summary ?? state.summary;
            })
            .addCase(fetchLegacyMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(saveLegacyMessage.fulfilled, (state, action) => {
                const idx = state.items.findIndex((item) => item.id === action.payload.id);
                if (idx >= 0) {
                    state.items[idx] = action.payload;
                } else {
                    state.items.unshift(action.payload);
                }
            })
            .addCase(armLegacyMessage.fulfilled, (state, action) => {
                const idx = state.items.findIndex((item) => item.id === action.payload.id);
                if (idx >= 0) {
                    state.items[idx] = action.payload;
                }
            })
            .addCase(disarmLegacyMessage.fulfilled, (state, action) => {
                const idx = state.items.findIndex((item) => item.id === action.payload.id);
                if (idx >= 0) {
                    state.items[idx] = action.payload;
                }
            })
            .addCase(toggleLegacyPause.fulfilled, (state, action) => {
                state.paused = action.payload.paused;
                state.legacyPausedAt = action.payload.legacy_paused_at;
            });
    },
});

export default legacySlice.reducer;
