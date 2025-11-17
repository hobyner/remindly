import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import remindersReducer from './slices/remindersSlice';
import templatesReducer from './slices/templatesSlice';
import contactsReducer from './slices/contactsSlice';
import legacyReducer from './slices/legacySlice';
import adminReducer from './slices/adminSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        reminders: remindersReducer,
        templates: templatesReducer,
        contacts: contactsReducer,
        legacy: legacyReducer,
        admin: adminReducer,
    },
});

export default store;
