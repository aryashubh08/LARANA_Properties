// redux/slices/state.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")),
  token: localStorage.getItem("token"),
  isLoggedIn: false,
};

const stateSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
    setListings: (state, action) => {
      state.listings = action.payload.listings;
    },
  },
});

export const { setLogin, setLogout, setListings } = stateSlice.actions;
export default stateSlice.reducer;
