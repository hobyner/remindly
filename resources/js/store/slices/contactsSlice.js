import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchContacts = createAsyncThunk('contacts/fetch', async (params = {}) => {
    const { data } = await api.get('/contacts', { params });
    return data;
});

export const createContact = createAsyncThunk('contacts/create', async (payload) => {
    const { data } = await api.post('/contacts', payload);
    return data;
});

const contactsSlice = createSlice({
    name: 'contacts',
    initialState: {
        items: [],
        pagination: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContacts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.data ?? action.payload;
                state.pagination = action.payload.meta ?? {};
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createContact.fulfilled, (state, action) => {
                const contact = action.payload.data ?? action.payload;
                state.items.unshift(contact);
            });
    },
});

export default contactsSlice.reducer;
