import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/slices/state";
import ListingCard from "../components/ListingCard";
import toast from "react-hot-toast";
import Footer from "../components/Footer";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const { category } = useParams(); // selected category
  const listings = useSelector((state) => state.listings) || [];

  const getCategoryListings = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://larana-properties-server.vercel.app/api/v1/creator/get-listing?category=${category}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to load listings");
        setLoading(false);
        return;
      }

      dispatch(setListings({ listings: data.listings })); // update redux
      setLoading(false);
    } catch (error) {
      console.error("fetch listings failed", error.message);
      toast.error("Server error. Try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoryListings();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <Navbar />
      <h1 className="mt-30 px-20 text-2xl font-semibold">
        {category} listings
      </h1>

      {listings.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No listings found for "{category}".
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-10 mt-10">
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
            }) => (
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
            )
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default CategoryPage;
