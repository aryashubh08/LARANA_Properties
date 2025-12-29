import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { facilities } from "../data";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { BsCurrencyRupee } from "react-icons/bs";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Footer from "../components/Footer";

const ListingDetails = () => {
  const navigate = useNavigate();
  const customerId = useSelector((state) => state?.user?._id);
  const { listingId } = useParams();

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [selectedRange, setSelectedRange] = useState({
    from: null,
    to: null,
  });

  const getListingDetails = async () => {
    try {
      const res = await fetch(
        `https://larana-properties-server.vercel.app/api/v1/creator/get-listing/${listingId}`
      );
      const data = await res.json();
      setListing(data.listing);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch listing");
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
      ? Math.round((selectedRange.to - selectedRange.from) / 86400000) + 1
      : 0;

  const handleSubmit = async () => {
    if (!selectedRange.from || !selectedRange.to) {
      toast.error("Please choose your stay duration!");
      return;
    }

    const bookingForm = {
      customerId,
      listingId,
      hostId: listing.creator._id,
      startDate: selectedRange.from.toDateString(),
      endDate: selectedRange.to.toDateString(),
      totalPrice: listing.price * dayCount,
    };

    const toastId = toast.loading("Booking your stay...");

    const response = await fetch(
      "https://larana-properties-server.vercel.app/api/v1/bookings/create-booking",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingForm),
      }
    );

    toast.dismiss(toastId);

    if (response.ok) {
      toast.success("Booking confirmed!");
      navigate(`/${customerId}/trips`);
    } else {
      toast.error("Booking failed. Try again.");
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-30">
        {loading || !listing ? (
          <p className="text-gray-600 text-center mt-30">Loading...</p>
        ) : (
          <div className="space-y-10">
            {/* TITLE */}
            <div>
              <h1 className="text-4xl font-bold">{listing.title}</h1>
              <p className="text-gray-600 mt-1 text-lg">
                {listing.type} • {listing.city}, {listing.province},{" "}
                {listing.country}
              </p>
            </div>

            {/* PHOTOS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 rounded-xl overflow-hidden">
              {listing.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt="Listing"
                  className="w-full h-64 object-cover rounded-xl shadow-md"
                />
              ))}
            </div>

            {/* HOST INFO */}
            <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow ">
              <img
                src={listing.creator.profileImagePath}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">
                  Hosted by {listing.creator.firstName}{" "}
                  {listing.creator.lastName}
                </h3>
                <p className="text-gray-600 text-sm">
                  {listing.guestCount} guests • {listing.bedroomCount} bedrooms
                  • {listing.bedCount} beds • {listing.bathroomCount} bathrooms
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white p-6 rounded-xl shadow  space-y-4">
              <h2 className="text-2xl font-semibold">About this place</h2>
              <p className="text-gray-700 leading-relaxed">
                {listing.description}
              </p>

              <h3 className="text-xl font-semibold pt-4">
                {listing.highlight}
              </h3>
              <p className="text-gray-600">{listing.highlightDescription}</p>
            </div>

            {/* AMENITIES */}
            <div className="bg-white p-6 rounded-xl shadow ">
              <h2 className="text-2xl font-semibold mb-5">
                What this place offers
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.amenities.map((am, i) => {
                  const facility = facilities.find(
                    (f) => f.name.toLowerCase() === am.toLowerCase()
                  );

                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg shadow-sm"
                    >
                      <span className="text-3xl">{facility?.icon}</span>
                      <span className="text-gray-700">{am}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOOKING SECTION */}

            <div className="w-full flex justify-center">
              <div className="bg-white p-6 rounded-xl shadow  w-full max-w-6xl">
                <h2 className="text-2xl font-semibold mb-6">
                  Choose your stay duration
                </h2>

                {/* Flex: Column on mobile, Row on laptop */}
                <div className="flex flex-col lg:flex-row gap-10">
                  {/* LEFT: Calendar */}
                  <div className="w-full lg:w-1/2 rounded-xl p-2 overflow-x-auto">
                    <div className="min-w-[320px] origin-top-left scale-90 md:scale-95">
                      <DayPicker
                        mode="range"
                        selected={selectedRange}
                        onSelect={handleSelect}
                      />
                    </div>
                  </div>

                  {/* RIGHT: Booking Summary */}
                  {dayCount > 0 && (
                    <div className="w-full lg:w-1/2 space-y-3">
                      <h3 className="text-xl font-semibold">
                        <span className="flex items-center gap-2">
                          <BsCurrencyRupee />
                          {listing.price} × {dayCount} night
                          {dayCount > 1 ? "s" : ""}
                        </span>
                      </h3>

                      <p className="text-gray-700 font-medium">
                        Total: ₹{listing.price * dayCount}
                      </p>

                      <p className="text-sm text-gray-600">
                        From: {selectedRange.from.toDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        To: {selectedRange.to.toDateString()}
                      </p>

                      <button
                        onClick={handleSubmit}
                        className="mt-5 w-full text-white py-3 rounded-xl text-lg font-semibold shadow-lg transition duration-300"
                        style={{
                          background: "linear-gradient(90deg,#B8860B,#D4AF37)",
                        }}
                      >
                        BOOK NOW
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ListingDetails;
