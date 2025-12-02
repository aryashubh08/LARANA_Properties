import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { categories, facilities, types } from "../data";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoMdPhotos } from "react-icons/io";
import { BsCurrencyRupee } from "react-icons/bs";
import TextInput from "../components/TextInput";
import CounterBox from "../components/CounterBox";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Footer from "../components/Footer";

const CreateListing = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [amenities, setAmenities] = useState([]);

  const [formLocation, setFormLocation] = useState({
    streetAddress: "",
    apartment: "",
    city: "",
    province: "",
    country: "",
  });

  const [formDescription, setFormDescription] = useState({
    title: "",
    description: "",
    highlight: "",
    highlightDetails: "",
    price: "",
  });

  const [guestCount, setGuestCount] = useState(1);
  const [bedroomCount, setBedroomCount] = useState(1);
  const [bedCount, setBedCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);

  const handleFacilityClick = (name) => {
    setAmenities((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setFormLocation({ ...formLocation, [name]: value });
  };

  const handleUploadPhotos = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prev) => [...prev, ...files]);
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(photos);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setPhotos(reordered);
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription({ ...formDescription, [name]: value });
  };

  const creatorId = useSelector((state) => state.user._id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // SIMPLE VALIDATIONS
    if (!category) return toast.error("Please select a category");
    if (!type) return toast.error("Please select a place type");
    if (photos.length === 0)
      return toast.error("Please upload at least 1 photo");
    if (!formDescription.title || !formDescription.price)
      return toast.error("Title & Price are required");

    try {
      const listingForm = new FormData();

      listingForm.append("userId", creatorId);
      listingForm.append("category", category);
      listingForm.append("type", type);
      listingForm.append("streetAddress", formLocation.streetAddress);
      listingForm.append("apartment", formLocation.apartment);
      listingForm.append("city", formLocation.city);
      listingForm.append("province", formLocation.province);
      listingForm.append("country", formLocation.country);
      listingForm.append("guestCount", guestCount);
      listingForm.append("bedroomCount", bedroomCount);
      listingForm.append("bedCount", bedCount);
      listingForm.append("bathroomCount", bathroomCount);
      listingForm.append("title", formDescription.title);
      listingForm.append("description", formDescription.description);
      listingForm.append("highlight", formDescription.highlight);
      listingForm.append("highlightDetails", formDescription.highlightDetails);
      listingForm.append("price", formDescription.price);
      listingForm.append("amenities", JSON.stringify(amenities));

      photos.forEach((photo) => {
        listingForm.append("listingPhotos", photo);
      });

      const loadingToast = toast.loading("Publishing your listing...");

      const response = await fetch(
        "http://localhost:4400/api/v1/creator/create-listing",
        {
          method: "POST",
          body: listingForm,
        }
      );

      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success("Listing Published Successfully!");
        navigate("/");
      } else {
        toast.error("Failed to publish listing");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="pt-28 px-4 md:pt-32 md:px-10">
        <h1 className="text-2xl font-semibold mb-6">Publish Your Place</h1>

        <form onSubmit={handleSubmit} className="p-8 rounded-lg bg-white">
          {/* STEP 1 */}
          <h2 className="text-red-500 mb-1 font-semibold text-lg">
            Step 1: Tell us about your place
          </h2>
          <hr className="border-gray-400" />

          {/* CATEGORY */}
          <p className="py-8">
            Which of these categories best describe your place?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-2 sm:px-10 md:px-30">
            {categories.map((cat, index) => (
              <div
                key={index}
                onClick={() => setCategory(cat.label)}
                className={`${
                  category === cat.label
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } border rounded-lg flex flex-col items-center justify-center gap-2 py-6 shadow-sm hover:shadow-md transition cursor-pointer`}
              >
                <div className="text-4xl">{cat.icon}</div>
                <p className="text-gray-700 text-sm">{cat.label}</p>
              </div>
            ))}
          </div>

          {/* TYPE */}
          <h2 className="pt-10 pb-4">What type of place will guests have?</h2>
          <div className="flex flex-col gap-3 sm:max-w-[50%]">
            {types.map((t, index) => (
              <div
                key={index}
                onClick={() => setType(t.name)}
                className={`${
                  type === t.name
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } border rounded-lg py-3 px-5 flex justify-between shadow-sm hover:shadow-md transition cursor-pointer`}
              >
                <div>
                  <h4 className="font-medium">{t.name}</h4>
                  <p className="text-gray-600 text-sm">{t.description}</p>
                </div>
                <div className="text-2xl">{t.icon}</div>
              </div>
            ))}
          </div>

          {/* LOCATION */}
          <h2 className="pt-10 pb-4">Where's your place located?</h2>
          <div className="w-full lg:max-w-[50%]">
            {/* STREET ADDRESS */}
            <div className="py-4">
              <p>Street Address</p>
              <input
                type="text"
                name="streetAddress"
                placeholder="Street address"
                value={formLocation.streetAddress}
                onChange={handleChangeLocation}
                className="border rounded-lg py-2 px-4 w-full"
                required
              />
            </div>

            {/* APARTMENT + CITY */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full">
                <p>Apartment, Suite (optional)</p>
                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment"
                  value={formLocation.apartment}
                  onChange={handleChangeLocation}
                  className="border rounded-lg py-2 px-4 w-full"
                />
              </div>

              <div className="w-full">
                <p>City</p>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formLocation.city}
                  onChange={handleChangeLocation}
                  className="border rounded-lg py-2 px-4 w-full"
                  required
                />
              </div>
            </div>

            {/* PROVINCE + COUNTRY */}
            <div className="flex flex-col md:flex-row gap-6 py-4">
              <div className="w-full">
                <p>Province</p>
                <input
                  type="text"
                  name="province"
                  placeholder="Province"
                  value={formLocation.province}
                  onChange={handleChangeLocation}
                  className="border rounded-lg py-2 px-4 w-full"
                  required
                />
              </div>

              <div className="w-full">
                <p>Country</p>
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formLocation.country}
                  onChange={handleChangeLocation}
                  className="border rounded-lg py-2 px-4 w-full"
                  required
                />
              </div>
            </div>

            {/* BASICS */}
            <h2 className="mt-6 mb-2 font-medium">
              Share some basics about your place
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <CounterBox
                title="Guests"
                count={guestCount}
                setCount={setGuestCount}
              />
              <CounterBox
                title="Bedrooms"
                count={bedroomCount}
                setCount={setBedroomCount}
              />
              <CounterBox
                title="Beds"
                count={bedCount}
                setCount={setBedCount}
              />
              <CounterBox
                title="Bathrooms"
                count={bathroomCount}
                setCount={setBathroomCount}
              />
            </div>
          </div>

          {/* STEP 2 */}
          <h2 className="text-red-500 mb-1 mt-10 font-semibold text-lg">
            Step 2: Make your place stand out
          </h2>
          <hr className="border-gray-400" />
          <p className="py-8">Tell guests what your place has to offer</p>

          {/* FACILITIES */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-2 sm:px-10 md:px-30">
            {facilities.map((fac, index) => (
              <div
                key={index}
                onClick={() => handleFacilityClick(fac.name)}
                className={`${
                  amenities.includes(fac.name)
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } border flex flex-col items-center justify-center rounded-lg py-6 shadow-sm hover:shadow-md transition cursor-pointer`}
              >
                <div className="text-4xl">{fac.icon}</div>
                <p className="text-gray-700 text-sm">{fac.name}</p>
              </div>
            ))}
          </div>

          {/* PHOTOS */}
          <div className="w-full mt-10">
            <h2 className="mb-4 font-medium">Add some photos of your place</h2>

            <DragDropContext onDragEnd={handleDragPhoto}>
              <Droppable droppableId="photos" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex gap-4 flex-wrap"
                  >
                    {photos.map((photo, index) => (
                      <Draggable
                        key={photo.name + index}
                        draggableId={photo.name + index}
                        index={index}
                      >
                        {(drag) => (
                          <div
                            ref={drag.innerRef}
                            {...drag.draggableProps}
                            {...drag.dragHandleProps}
                            className="relative"
                          >
                            <img
                              src={URL.createObjectURL(photo)}
                              className="w-[200px] h-[150px] object-cover rounded"
                            />
                            <button
                              onClick={() => handleRemovePhoto(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full cursor-pointer hover:bg-red-600 transition"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {/* Upload Box */}
                    <label
                      htmlFor="image"
                      className="border border-dashed border-gray-400 flex items-center justify-center flex-col gap-2 p-4 w-[200px] h-[150px] rounded cursor-pointer hover:bg-gray-100 transition"
                    >
                      <IoMdPhotos className="text-5xl" />
                      <p>Upload</p>
                    </label>
                    <input
                      id="image"
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleUploadPhotos}
                    />

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-10">
            <h2 className="font-semibold text-lg">
              What makes your place attractive?
            </h2>

            <TextInput
              label="Title"
              name="title"
              value={formDescription.title}
              onChange={handleChangeDescription}
            />
            <TextInput
              label="Description"
              name="description"
              value={formDescription.description}
              onChange={handleChangeDescription}
            />
            <TextInput
              label="Highlight"
              name="highlight"
              value={formDescription.highlight}
              onChange={handleChangeDescription}
            />
            <TextInput
              label="Highlight Details"
              name="highlightDetails"
              value={formDescription.highlightDetails}
              onChange={handleChangeDescription}
            />

            {/* Price */}
            <div className="pt-4 w-full md:w-1/2 flex items-center gap-2">
              <BsCurrencyRupee className="text-xl" />
              <input
                type="number"
                placeholder="1000"
                name="price"
                value={formDescription.price}
                onChange={handleChangeDescription}
                className="border rounded-lg py-2 px-4 w-[150px]"
                required
              />
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="mt-10 bg-red-500 text-white py-3 px-10 rounded-lg hover:bg-red-600 transition cursor-pointer"
          >
            Publish Listing
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreateListing;
