import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { setReservationList } from "../redux/slices/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const ReservationList = () => {
  const [loading, setLoading] = useState(true);

  const userId = useSelector((state) => state.user?._id);
  const reservationList = useSelector((state) => state.user?.reservationList);

  const token =
    useSelector((state) => state.token) || localStorage.getItem("token");

  const dispatch = useDispatch();

  const getReservationList = async () => {
    try {
      const response = await fetch(
        `http://localhost:4400/api/v1/user/${userId}/reservationList`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);

      dispatch(setReservationList(data.reservation));
      setLoading(false);
    } catch (error) {
      console.log("fetch reservationList failed", error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      getReservationList();
    }
  }, [userId]);

  return loading ? (
    <Loader />
  ) : (
    <>
      {" "}
      <div className="px-4 sm:px-8 md:px-16 lg:px-20 pt-32">
        <h1 className="my-6 text-xl font-semibold">Your Reservation List</h1>

        <div
          className="
          grid 
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
        >
          {reservationList?.map(
            ({
              listingId,
              startDate,
              hostId,
              totalPrice,

              endDate,
              bookings = true,
            }) => {
              return (
                <ListingCard
                  key={reservationList._id}
                  creator={hostId._id}
                  listingId={listingId._id}
                  startDate={startDate}
                  endDate={endDate}
                  totalPrice={totalPrice}
                  photos={listingId.photos}
                  city={listingId.city}
                  province={listingId.province}
                  country={listingId.country}
                  category={listingId.category}
                  booking={bookings}
                />
              );
            }
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReservationList;
