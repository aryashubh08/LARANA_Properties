import React, { useState } from "react";
import { SlArrowLeftCircle, SlArrowRightCircle } from "react-icons/sl";
import { BsCurrencyRupee } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setWishList } from "../redux/slices/state";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useEffect } from "react";

const ListingCard = ({
  listingId,
  creator,
  photos = [],
  title,
  city,
  province,
  country,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];
  const isLiked = wishList.some((item) => item?._id?.toString() === listingId);
  console.log(wishList);

  const goToPrevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToNextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const toggleWishList = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      if (user?._id !== creator._id) {
        const response = await fetch(
          `https://larana-properties-server.vercel.app/api/v1/user/${user._id}/${listingId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();

        if (!data.success) {
          toast.error(data.message || "Something went wrong");

          return;
        }

        toast.success(
          data.isLiked ? "Added to wishlist" : "Removed from wishlist"
        );
        console.log(data);
        // Update Redux
        dispatch(setWishList(data.wishList));
      } else {
        return;
      }
    } catch (err) {
      toast.error("Failed to update wishlist");
      console.log(err);
    }
  };

  return (
    <div className="relative rounded-xl shadow-lg bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer z-20">
      {/* Image Slider */}
      <Link to={`/get-listing/${listingId}`}>
        <div className="relative w-full h-56 sm:h-60 md:h-64 overflow-hidden rounded-xl">
          {photos.length > 0 ? (
            <>
              <img
                src={photos[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                className="w-full h-full object-cover bg-center rounded-xl"
              />
              {photos.length > 1 && (
                <>
                  <SlArrowLeftCircle
                    onClick={goToPrevSlide}
                    className="absolute top-1/2 left-3 text-white text-3xl cursor-pointer -translate-y-1/2 drop-shadow-xl"
                  />
                  <SlArrowRightCircle
                    onClick={goToNextSlide}
                    className="absolute top-1/2 right-3 text-white text-3xl cursor-pointer -translate-y-1/2 drop-shadow-xl"
                  />
                </>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 mt-20">No Image</p>
          )}
        </div>
      </Link>

      {/* Card Info */}
      <div className="mt-2 px-2">
        {/* Hotel Title */}
        <h2 className="text-lg font-bold text-gray-900 truncate">{title}</h2>
        {/* <h2 className="text-lg font-bold text-gray-800">
          {city}, {province}, {country}
        </h2> */}
        <p className="text-sm text-gray-500 capitalize">{category}</p>
        {!booking ? (
          <>
            <p className="text-sm text-gray-500 capitalize">{type}</p>
            <h3 className="font-semibold flex items-center text-lg text-gray-800 mt-1 mb-2">
              <BsCurrencyRupee className="mr-1" /> {price}
              <span className="text-sm text-gray-500 ml-1">per night</span>
            </h3>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 capitalize">
              {startDate} - {endDate}
            </p>
            <h3 className="font-semibold flex items-center text-lg text-gray-800 mt-1 mb-2">
              <BsCurrencyRupee className="mr-1" /> {totalPrice}
              <span className="text-sm text-gray-500 ml-1">total</span>
            </h3>
          </>
        )}
      </div>

      {/* Wishlist button */}
      <button onClick={toggleWishList} className="absolute top-3 right-3 z-50">
        <FaHeart
          className={`${isLiked ? "text-red-500" : "text-gray-100"} text-2xl`}
        />
      </button>
    </div>
  );
};

export default ListingCard;
