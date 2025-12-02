import React from "react";
import { Link } from "react-router-dom";
import { categories } from "../data";
import Footer from "./Footer";

const Categories = () => {
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl md:text-3xl lg:text-5xl text-gray-700 font-bold">
        Explore Top Categories
      </h1>

      <p className="w-full md:w-2/4 mt-5 text-gray-500 text-center mx-auto">
        Explore our wide range of vacation rentals that cater to all types of
        travelers. Immerse yourself in the local culture, enjoy the comforts of
        home, and create unforgettable memories in your dream destination.
      </p>

      <div className="grid grid-cols-2 mt-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {categories?.slice(1, 16).map((category, index) => (
          <Link
            to={`/get-listing/category/${category.label}`}
            key={index}
            className="relative overflow-hidden rounded-lg group h-[200px] w-full cursor-pointer"
          >
            {/* Background Image */}
            <img
              src={category?.img}
              alt={category.label}
              className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-110"
            />

            {/* Overlay */}
            <div
              className="
                absolute inset-0 
                bg-black/40 
                transition-colors duration-300 
                group-hover:bg-black/60
              "
            ></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-2 z-10">
              <div className="text-5xl">{category?.icon}</div>
              <p className="text-xl font-semibold">{category.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
