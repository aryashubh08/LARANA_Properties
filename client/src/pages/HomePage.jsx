import React from "react";
import Navbar from "../components/Navbar";
import Slide from "../components/Slide";
import Categories from "../components/Categories";

const HomePage = () => {
  return (
    <div className="w-full h-screen">
      <Navbar />
      <Slide />
      <Categories />
    </div>
  );
};

export default HomePage;
