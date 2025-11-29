import React from "react";
import { Link } from "react-router-dom";
import { categories } from "../data";

const Categories = () => {
  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl md:text-3xl lg:text-5xl text-gray-700 font-bold">
        Explore Top Categories
      </h1>

      <p className="w-4/5 md:w-2/4 mt-5 text-gray-500 text-center mx-auto">
        Explore our wide range of vacation rentals that cater to all types of
        travelers. Immerse yourself in the local culture, enjoy the comforts of
        home, and create unforgettable memories in your dream destination.
      </p>

      <div className="grid grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {categories?.slice(1, 9).map((category, index) => (
          <Link
            to=""
            key={index}
            className="relative overflow-hidden rounded-sm group h-[250px] w-full"
          >
            {/* Background Image */}
            <img
              src={category?.img}
              alt=""
              className="w-full h-full object-cover"
            />

            {/* Overlay (ONLY overlay animates) */}
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
