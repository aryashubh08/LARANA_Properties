import React, { useEffect, useState } from "react";
import ListingCard from "../components/ListingCard";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setPropertyList } from "../redux/slices/state";
import Loader from "../components/Loader";
import Footer from "../components/Footer";

const PropertyList = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const propertyList = user?.propertyList || [];
  const dispatch = useDispatch();
  console.log(propertyList);
  const getPropertyList = async () => {
    try {
      const response = await fetch(
        `https://larana-properties-server.vercel.app/api/v1/user/${user._id}/propertyList`,
        { method: "GET" }
      );

      const data = await response.json();
      console.log(data);

      if (!data.success) {
        toast.error(data.message || "Failed to fetch properties");
        setLoading(false);
        return;
      }

      // Update Redux with actual property list
      dispatch(setPropertyList(data.properties || []));
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      console.log("fetch all properties failed", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPropertyList();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <div className="px-4 sm:px-8 md:px-16 lg:px-20 pt-32">
        <h1 className="my-6 text-xl font-semibold">Your Property List</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {propertyList.map(
            ({
              _id,
              creator,
              photos,
              city,
              province,
              country,
              category,
              price,
              type,
              booking = false,
            }) => (
              <ListingCard
                key={_id}
                listingId={_id}
                creator={creator}
                price={price}
                photos={photos}
                city={city}
                province={province}
                country={country}
                category={category}
                type={type}
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

export default PropertyList;
