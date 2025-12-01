// redux/slices/state.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    ...JSON.parse(localStorage.getItem("user")),
    tripList: [],
    wishList: [],
    propertyList: [],
    reservationList: [],
  },

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
      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setListings: (state, action) => {
      state.listings = action.payload.listings;
    },
    setTripList: (state, action) => {
      state.user.tripList = action.payload;
    },
    setWishList: (state, action) => {
      if (state.user) {
        state.user.wishList = action.payload;
      }
    },
    setPropertyList: (state, action) => {
      state.user.propertyList = action.payload;
    },
    setReservationList: (state, action) => {
      state.user.reservationList = action.payload;
    },
  },
});

export const {
  setLogin,
  setLogout,
  setListings,
  setTripList,
  setPropertyList,
  setWishList,
  setReservationList,
} = stateSlice.actions;
export default stateSlice.reducer;
