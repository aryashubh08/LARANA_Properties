import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { initLenis } from "./lenis";
import CreateListing from "./pages/CreateListing";

const App = () => {
  useEffect(() => {
    const lenis = initLenis();

    return () => {
      Lenis.destroy();
    };
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-listing" element={<CreateListing />} />
      </Routes>
    </>
  );
};

export default App;
