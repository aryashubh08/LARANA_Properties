import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setListings } from "../redux/slices/state";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const SearchPage = () => {
  const { search } = useParams();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings);

  const getSearchListing = async () => {
    try {
      const response = await fetch(
        `https://larana-properties-server.vercel.app/api/v1/creator/get-listing/search/${search}`
      );

      const data = await response.json();
      console.log("Search response:", data);

      // directly use data.listings
      dispatch(setListings({ listings: data.listings || [] }));
    } catch (error) {
      console.log("Search API failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // YOU FORGOT THIS!
  useEffect(() => {
    setLoading(true);
    getSearchListing();
  }, [search]);

  return loading ? (
    <Loader />
  ) : (
    <div>
      <Navbar />

      <h1 className="mt-30 px-20 text-3xl font-semibold capitalize">
        {search}
      </h1>

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
        {listings?.length > 0 ? (
          listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listingId={listing._id}
              creator={listing.creator}
              photos={listing.photos}
              city={listing.city}
              province={listing.province}
              country={listing.country}
              category={listing.category}
              type={listing.type}
              price={listing.price}
              booking={listing.booking}
            />
          ))
        ) : (
          <p className="text-gray-600 text-xl col-span-full text-center">
            No listings found for "{search}"
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
