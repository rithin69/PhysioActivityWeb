// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './roleSlice';  // We'll create the role slice next
import userReducer from "./userslice";

const store = configureStore({
  reducer: {
    role: roleReducer, 
    user: userReducer // Register the role reducer here
  },
});

export default store;
