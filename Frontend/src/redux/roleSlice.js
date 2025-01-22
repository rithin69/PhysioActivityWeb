// src/roleSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  role: 'Guest',  // Set the default role (Guest)
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;  // Update the role
    },
  },
});

export const { setRole } = roleSlice.actions;  // Export the action to change the role
export default roleSlice.reducer;  // Export the reducer
