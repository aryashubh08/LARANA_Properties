import React, { useState } from "react";
import { SlArrowLeftCircle, SlArrowRightCircle } from "react-icons/sl";
import { BsCurrencyRupee } from "react-icons/bs";
import { Link } from "react-router-dom";

const ListingCard = ({
  listingId,
  creator,
  photos = [],
  city,
  province,
  country,
  category,
  type,
  price,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToNextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <Link
      to={`/get-listing/${listingId}`}
      className="
        rounded-xl 
        shadow-lg 
        bg-white 
        relative 
        hover:shadow-2xl 
        transition-all 
        duration-300 
        cursor-pointer
      "
    >
      {/* Image Slider */}
      <div className="relative w-full h-56 sm:h-60 md:h-64  overflow-hidden rounded-xl">
        {photos.length > 0 ? (
          <>
            <img
              src={photos[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-full object-cover bg-center rounded-xl"
            />

            {/* Left Arrow */}
            {photos.length > 1 && (
              <SlArrowLeftCircle
                onClick={goToPrevSlide}
                className="
                  absolute 
                  top-1/2 
                  left-3 
                  text-white 
                  text-3xl 
                  cursor-pointer 
                  -translate-y-1/2
                  drop-shadow-xl
                "
              />
            )}

            {/* Right Arrow */}
            {photos.length > 1 && (
              <SlArrowRightCircle
                onClick={goToNextSlide}
                className="
                  absolute 
                  top-1/2 
                  right-3 
                  text-white 
                  text-3xl 
                  cursor-pointer 
                  -translate-y-1/2
                  drop-shadow-xl
                "
              />
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 mt-20">No Image</p>
        )}
      </div>

      {/* Card Info */}
      <div className="mt-2 ">
        <h2 className="text-lg font-bold text-gray-800 px-2">
          {city}, {province}, {country}
        </h2>

        <p className="text-sm text-gray-500 capitalize px-2">{category}</p>
        <p className="text-sm text-gray-500 capitalize px-2">{type}</p>

        <h3 className="font-semibold flex items-center text-lg px-2 text-gray-800 mt-1 mb-2">
          <BsCurrencyRupee className="mr-1" />
          {price}
          <span className="text-sm text-gray-500 ml-1">per night</span>
        </h3>
      </div>
    </Link>
  );
};

export default ListingCard;
