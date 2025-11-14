import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import remindersReducer from './slices/remindersSlice';
import templatesReducer from './slices/templatesSlice';
import contactsReducer from './slices/contactsSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        reminders: remindersReducer,
        templates: templatesReducer,
        contacts: contactsReducer,
    },
});

export default store;
