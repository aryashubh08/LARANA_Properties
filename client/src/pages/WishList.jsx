import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const WishList = () => {
  const wishList = useSelector((state) => state.user.wishList);
  console.log(wishList);

  return (
    <>
      <div>
        <Navbar />
        <h1 className="mt-30 px-20 text-2xl font-semibold">Your Wish List</h1>
        <div
          className="
          grid 
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-6
          px-10
          mt-10
        "
        >
          {wishList.map(
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
            }) => (
              <ListingCard
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
            )
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WishList;
