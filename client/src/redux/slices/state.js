// redux/slices/state.js
import { createSlice } from "@reduxjs/toolkit";

// --------------------------------------
// Load saved data from localStorage
// --------------------------------------
const savedUser = JSON.parse(localStorage.getItem("user")) || null;
const savedToken = localStorage.getItem("token") || null;
const savedWishList = JSON.parse(localStorage.getItem("wishList")) || [];

// --------------------------------------
// Initial State
// --------------------------------------
const initialState = {
  user: savedUser
    ? {
        ...savedUser,
        wishList: savedWishList,
        tripList: savedUser.tripList || [],
        propertyList: savedUser.propertyList || [],
        reservationList: savedUser.reservationList || [],
      }
    : null,

  token: savedToken,
  isLoggedIn: savedUser ? true : false,
};

// --------------------------------------
// Slice
// --------------------------------------
const stateSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // LOGIN
    setLogin: (state, action) => {
      state.user = {
        ...action.payload.user,
        wishList: action.payload.user.wishList || savedWishList,
        tripList: action.payload.user.tripList || [],
        propertyList: action.payload.user.propertyList || [],
        reservationList: action.payload.user.reservationList || [],
      };

      state.token = action.payload.token;
      state.isLoggedIn = true;

      // save to localStorage
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("token", state.token);
      localStorage.setItem(
        "wishList",
        JSON.stringify(state.user.wishList || [])
      );
    },

    // LOGOUT
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("wishList");
    },

    // LISTINGS
    setListings: (state, action) => {
      state.listings = action.payload.listings;
    },

    // TRIPS
    setTripList: (state, action) => {
      if (state.user) {
        state.user.tripList = action.payload;
      }
    },

    // WISHLIST
    setWishList: (state, action) => {
      if (state.user) {
        state.user.wishList = action.payload;

        // Save persistently
        localStorage.setItem("wishList", JSON.stringify(state.user.wishList));

        // Also update user object stored in localStorage
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },

    // PROPERTY LIST
    setPropertyList: (state, action) => {
      if (state.user) {
        state.user.propertyList = action.payload;
      }
    },

    // RESERVATION LIST
    setReservationList: (state, action) => {
      if (state.user) {
        state.user.reservationList = action.payload;
      }
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
