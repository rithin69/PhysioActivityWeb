import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  web_user_id:null,
  name: null,
  email: null,
  country: null,
  isAdmin: null, // ✅ added to store isAdmin cleanly
  navpanel:null,
  user_role:null,
  mypatients:null,
  newpatients:null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.web_user_id=action.payload.web_user_id
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.country = action.payload.country;
      state.isAdmin = action.payload.isAdmin; // ✅ correct way
      state.navpanel= action.payload.navpanel;
      state.user_role=action.payload.user_role;
      state.mypatients=action.payload.mypatients;
      state.newpatients=action.payload.newpatients;

    },
    clearUserInfo: (state) => {
      state.web_user_id=null;
      state.name = null;
      state.email = null;
      state.country = null;
      state.isAdmin = null; // ✅ also clear it
      state.navpanel=null;
      state.user_role=null;
      state.mypatients=null
      state.newpatients=null
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
