import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { initLenis } from "./lenis";
import CreateListing from "./pages/CreateListing";
import ListingDetails from "./pages/ListingDetails";
import Navbar from "./components/Navbar";
import TripList from "./pages/TripList";
import { Toaster } from "react-hot-toast";
import WishList from "./pages/WishList";
import PropertyList from "./pages/PropertyList";
import ReservationList from "./pages/ReservationList";

const App = () => {
  useEffect(() => {
    const lenis = initLenis();

    return () => {
      lenis.destroy(); // fixed: Lenis → lenis
    };
  }, []);

  return (
    <>
      {/* 🔥 Toaster added here */}
      <Toaster position="top-center" reverseOrder={false} />

      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/get-listing/:listingId" element={<ListingDetails />} />
        <Route path="/:userId/trips" element={<TripList />} />
        <Route path="/:userId/wishList" element={<WishList />} />
        <Route path="/:userId/propertyList" element={<PropertyList />} />
        <Route path="/:userId/reservationList" element={<ReservationList />} />
      </Routes>
    </>
  );
};

export default App;
