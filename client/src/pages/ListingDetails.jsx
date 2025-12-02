import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { facilities } from "../data";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { BsCurrencyRupee } from "react-icons/bs";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast"; // ⬅ ADD THIS
import Footer from "../components/Footer";

const ListingDetails = () => {
  const navigate = useNavigate();
  const customerId = useSelector((state) => state?.user?._id);
  const [selectedRange, setSelectedRange] = useState({ from: null, to: null });

  const [loading, setLoading] = useState(true);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);

  const getListingDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:4400/api/v1/creator/get-listing/${listingId}`,
        { method: "GET" }
      );
      const data = await response.json();
      setListing(data.listing);
      setLoading(false);
    } catch (error) {
      console.log("Fetch listing details failed", error.message);
      toast.error("Failed to load listing");
    }
  };

  useEffect(() => {
    getListingDetails();
  }, []);

  const handleSelect = (range) => {
    setSelectedRange(range);
  };

  const dayCount =
    selectedRange.from && selectedRange.to
      ? Math.round(
          (selectedRange.to - selectedRange.from) / (1000 * 60 * 60 * 24)
        ) + 1
      : 0;

  // submit bookings
  const handleSubmit = async () => {
    if (!selectedRange.from || !selectedRange.to) {
      toast.error("Please select start and end dates");
      return;
    }

    try {
      const bookingForm = {
        customerId,
        listingId,
        hostId: listing.creator._id,
        startDate: selectedRange.from.toDateString(),
        endDate: selectedRange.to.toDateString(),
        totalPrice: listing.price * dayCount,
      };

      const loadingToast = toast.loading("Processing your booking...");

      const response = await fetch(
        "https://larana-properties-server.vercel.app/api/v1/bookings/create-booking",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(bookingForm),
        }
      );

      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success("Booking confirmed!");
        navigate(`/${customerId}/trips`);
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch (error) {
      console.log("Submit booking failed", error.message);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="my-30 md:px-20 px-10">
      {!listing ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1 className="text-3xl font-semibold">{listing.title}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
            {listing.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Photo ${index}`}
                className="w-full h-60 object-cover rounded-lg"
              />
            ))}
          </div>

          <h2 className="text-gray-600 font-semibold py-2">
            {listing.type} in {listing.city}, {listing.province},{" "}
            {listing.country}
          </h2>
          <p className="text-gray-600 pb-4">
            {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
            {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
          </p>
          <hr className="text-gray-400" />

          <div className="profile flex items-center gap-2 my-4">
            <img
              src={listing?.creator?.profileImagePath}
              className="h-10 w-10 rounded-full object-cover"
              alt=""
            />
            <h3 className="text-gray-600 font-semibold">
              Hosted by {listing.creator.firstName} {listing.creator.lastName}
            </h3>
          </div>
          <hr className="text-gray-400" />

          <h3 className="text-gray-600 font-semibold py-2 text-lg">
            Description
          </h3>
          <p className="text-gray-600 pb-4">{listing.description}</p>
          <hr className="text-gray-400" />

          <h3 className="py-2 text-gray-600 font-semibold text-lg">
            {listing.highlight}
          </h3>
          <p className="text-gray-600 pb-2 font-normal">
            {listing.highlightDescription}
          </p>
          <hr className="text-gray-400" />

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT SECTION */}
            <div className="lg:col-span-2 h-fit">
              <h2 className="text-2xl font-semibold">
                What this place offers?
              </h2>
              <div className="grid grid-cols-2 gap-4 mt-4 ">
                {listing.amenities.map((amenity, index) => {
                  const facility = facilities.find(
                    (facility) =>
                      facility.name.toLowerCase() === amenity.toLowerCase()
                  );

                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="text-4xl">{facility?.icon}</div>
                      <p className="text-lg text-gray-600">{amenity}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SECTION - Booking Calendar */}
            <div className="w-full p-5 rounded-xl sticky top-10 border">
              <h2 className="text-xl font-semibold mb-3">
                How long do you want to stay?
              </h2>

              <DayPicker
                mode="range"
                selected={selectedRange}
                onSelect={handleSelect}
                footer={
                  selectedRange.from &&
                  selectedRange.to &&
                  `Selected ${dayCount} night(s)`
                }
              />
            </div>

            {dayCount > 0 && (
              <div className="">
                <h2 className="text-xl font-semibold">
                  {listing.price} x {dayCount} night
                  {dayCount > 1 ? "s" : ""}
                </h2>
                <h2 className="flex text-lg text-gray-700 font-semibold items-center">
                  Total price: <BsCurrencyRupee />
                  {listing.price * dayCount}
                </h2>
                <p className="text-sm text-gray-600">
                  Start Date:{" "}
                  {selectedRange.from ? selectedRange.from.toDateString() : "-"}
                </p>
                <p className="text-sm text-gray-600">
                  End Date:{" "}
                  {selectedRange.to ? selectedRange.to.toDateString() : "-"}
                </p>
                <button
                  onClick={handleSubmit}
                  className="mt-10 bg-red-500 text-white py-3 px-10 rounded-lg hover:bg-red-600 transition cursor-pointer"
                >
                  BOOKING
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ListingDetails;
