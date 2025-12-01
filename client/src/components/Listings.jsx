import React, { useEffect, useState } from "react";
import { categories } from "../data";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/slices/state";
import Loader from "./Loader";
import ListingCard from "./ListingCard";
import toast from "react-hot-toast"; // ⬅️ Add this

const Listings = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const listings = useSelector((state) => state.listings);

  const getFeedListings = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        selectedCategory !== "All"
          ? `http://localhost:4400/api/v1/creator/get-listing?category=${selectedCategory}`
          : "http://localhost:4400/api/v1/creator/get-listing"
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to load listings");
        return;
      }

      dispatch(setListings({ listings: data.listings }));
      setLoading(false);
    } catch (error) {
      console.log("fetch listings failed", error.message);
      toast.error("Server error. Try again.");
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [selectedCategory]);

  return (
    <>
      {/* category buttons */}
      <div className="p-20 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 px-2 sm:px-10 md:px-30">
        {categories?.map((cate, index) => {
          const isSelected = selectedCategory === cate.label;

          return (
            <div
              onClick={() => {
                setSelectedCategory(cate.label);
              }}
              key={index}
              className={`
                relative overflow-hidden rounded-md group
                h-[200px] w-full cursor-pointer bg-cover bg-center
                transition-all duration-300
                ${
                  isSelected
                    ? "bg-red-100 border-2 border-red-400"
                    : "border border-gray-300"
                }
              `}
            >
              <div
                className={`
                  absolute inset-0 transition duration-300
                  ${
                    isSelected
                      ? "bg-black/20"
                      : "bg-black/40 group-hover:bg-black/60"
                  }
                `}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 gap-2">
                <div className="text-4xl">{cate.icon}</div>
                <p className="text-lg font-semibold">{cate.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {loading ? (
        <Loader />
      ) : listings.length === 0 ? (
        <>
          <p className="text-center text-gray-600 text-xl">
            No listings found.
          </p>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-10 py-10 ">
          {listings.map(
            ({
              _id,
              creator,
              photos,
              city,
              province,
              country,
              category,
              type,
              price,
              booking = false,
            }) => {
              return (
                <ListingCard
                  key={_id}
                  listingId={_id}
                  creator={creator}
                  photos={photos}
                  city={city}
                  province={province}
                  country={country}
                  category={category}
                  type={type}
                  price={price}
                  booking={booking}
                />
              );
            }
          )}
        </div>
      )}
    </>
  );
};

export default Listings;
