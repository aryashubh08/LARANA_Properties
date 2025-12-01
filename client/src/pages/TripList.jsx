import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { setTripList } from "../redux/slices/state";
import ListingCard from "../components/ListingCard";

const TripList = () => {
  const [loading, setLoading] = useState(true);

  const userId = useSelector((state) => state.user?._id);
  const tripList = useSelector((state) => state.user?.tripList);

  const token =
    useSelector((state) => state.token) || localStorage.getItem("token");

  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      const response = await fetch(
        `http://localhost:4400/api/v1/user/${userId}/trips`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);

      dispatch(setTripList(data.trips));
      setLoading(false);
    } catch (error) {
      console.log("fetch tripList failed", error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      getTripList();
    }
  }, [userId]);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-4 sm:px-8 md:px-16 lg:px-20 mt-30">
      <h1 className="my-6 text-xl font-semibold">Your Trip List</h1>

      <div
        className="
          grid 
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
      >
        {tripList?.map((trip) => {
          const { listingId, startDate, endDate, totalPrice } = trip;

          return (
            <ListingCard
              key={trip._id}
              listingId={listingId._id}
              startDate={startDate}
              endDate={endDate}
              totalPrice={totalPrice}
              photos={listingId.photos}
              city={listingId.city}
              province={listingId.province}
              country={listingId.country}
              category={listingId.category}
              booking={true}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TripList;
