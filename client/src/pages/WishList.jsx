import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";

const WishList = () => {
  const wishList = useSelector((state) => state.user.wishList);
  console.log(wishList);
  return (
    <div>
      <Navbar />
      <h1>Your Wish List</h1>
      <div>
        {wishList.map(({}) => (
          <ListingCard />
        ))}
      </div>
    </div>
  );
};

export default WishList;
