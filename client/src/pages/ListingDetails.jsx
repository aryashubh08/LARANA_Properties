import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { facilities } from "../data";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { BsCurrencyRupee } from "react-icons/bs";

const ListingDetails = () => {
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
    }
  };

  useEffect(() => {
    getListingDetails();
  }, []);

  // Booking dates state
  const [selectedRange, setSelectedRange] = useState({ from: null, to: null });

  const handleSelect = (range) => {
    setSelectedRange(range);
  };

  const dayCount =
    selectedRange.from && selectedRange.to
      ? Math.round(
          (selectedRange.to - selectedRange.from) / (1000 * 60 * 60 * 24)
        ) + 1
      : 0;

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

          <h2>
            {listing.type} in {listing.city}, {listing.province},{" "}
            {listing.country}
          </h2>
          <p>
            {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
            {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
          </p>
          <hr />

          <div className="profile flex items-center gap-2 my-4">
            <img
              src={listing?.creator?.profileImagePath}
              className="h-10 w-10 rounded-full object-cover"
              alt=""
            />
            <h3>
              Hosted by {listing.creator.firstName} {listing.creator.lastName}
            </h3>
          </div>
          <hr />

          <h3>Description</h3>
          <p>{listing.description}</p>
          <hr />

          <h3>{listing.highlight}</h3>
          <p>{listing.highlightDescription}</p>
          <hr />

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT SECTION */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold">
                What this place offers?
              </h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {listing.amenities.map((amenity, index) => {
                  const facility = facilities.find(
                    (facility) =>
                      facility.name.toLowerCase() === amenity.toLowerCase()
                  );

                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="text-xl">{facility?.icon}</div>
                      <p>{amenity}</p>
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

              {dayCount > 0 && (
                <div className="mt-4">
                  <h2>
                    {listing.price} x {dayCount} night{dayCount > 1 ? "s" : ""}
                  </h2>
                  <h2>
                    Total price: <BsCurrencyRupee />
                    {listing.price * dayCount}
                  </h2>
                  <p>
                    Start Date:{" "}
                    {selectedRange.from
                      ? selectedRange.from.toDateString()
                      : "-"}
                  </p>
                  <p>
                    End Date:{" "}
                    {selectedRange.to ? selectedRange.to.toDateString() : "-"}
                  </p>
                  <button className="mt-2 px-4 py-2 bg-blue-500 cursor-pointer text-white rounded">
                    BOOKING
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetails;
