// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './roleSlice';  // We'll create the role slice next

const store = configureStore({
  reducer: {
    role: roleReducer,  // Register the role reducer here
  },
});

export default store;
