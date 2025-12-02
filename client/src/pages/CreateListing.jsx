import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TextInput from "../components/TextInput";
import CounterBox from "../components/CounterBox";
import { categories, facilities, types } from "../data";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { IoMdPhotos } from "react-icons/io";
import { BsCurrencyRupee } from "react-icons/bs";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Premium Luxury theme colors
// GOLD: #D4AF37  (used as accent)
// CREAM: #FFF7ED (page background)

export default function CreateListing() {
  const navigate = useNavigate();
  const creatorId = useSelector((s) => s.user?._id);

  // form states
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

  const fileRef = useRef(null);

  // handlers
  const handleFacilityClick = (name) => {
    setAmenities((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setFormLocation((p) => ({ ...p, [name]: value }));
  };

  const handleChangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription((p) => ({ ...p, [name]: value }));
  };

  const handleUploadPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    // keep only image files
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    setPhotos((prev) => [...prev, ...imageFiles].slice(0, 12)); // limit 12 photos
    // reset input for same-file re-upload
    e.target.value = null;
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(photos);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setPhotos(reordered);
  };

  const handleRemovePhoto = (index) => {
    setPhotos((p) => p.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!category) return "Please select a category";
    if (!type) return "Please select a place type";
    if (photos.length === 0) return "Please upload at least 1 photo";
    if (!formDescription.title || !formDescription.price)
      return "Title & Price are required";
    if (!formLocation.city || !formLocation.province || !formLocation.country)
      return "Please fill city, province and country";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

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

      photos.forEach((photo) => listingForm.append("listingPhotos", photo));

      const loading = toast.loading("Publishing your listing...");
      const res = await fetch(
        "https://larana-properties-server.vercel.app/api/v1/creator/create-listing",
        { method: "POST", body: listingForm }
      );
      toast.dismiss(loading);

      if (res.ok) {
        toast.success("Listing Published Successfully!");
        navigate("/");
      } else {
        const text = await res.text().catch(() => "");
        console.error("publish fail:", text);
        toast.error("Failed to publish listing");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  // Small presentational helpers
  const gold = "#D4AF37";

  return (
    <div
      className="min-h-screen"
      // style={{ background: "linear-gradient(180deg,#FFF7ED 0%, #FFFDF8 100%)" }}
    >
      <Navbar />

      <main className="max-w-7xl mx-auto px-2 lg:px-8 pt-28 pb-20">
        <div className="bg-white border border-amber-100 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* LEFT - Form */}
            <section className="w-full lg:w-2/3 p-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-gray-800">
                    Publish your luxury listing
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Premium presentation for premium properties — cream & gold
                    theme.
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                    style={{ background: "rgba(212,175,55,0.12)", color: gold }}
                  >
                    Premium
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* STEP CARD */}
                <div className="rounded-2xl border border-gray-100 p-6 bg-gradient-to-b from-white/60 to-white shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-medium text-gray-800">
                        1. Tell us about your place
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Quick details that help guests find and trust your
                        place.
                      </p>
                    </div>
                    <div className="text-sm text-gray-400">Step 1</div>
                  </div>

                  {/* Categories */}
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((cat, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCategory(cat.label)}
                        className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-shadow border ${
                          category === cat.label
                            ? "border-amber-300 shadow-lg bg-amber-50/40"
                            : "border-gray-100 hover:shadow-md"
                        }`}
                      >
                        <div className="text-3xl">{cat.icon}</div>
                        <div className="text-sm font-medium text-gray-700">
                          {cat.label}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Type */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700">
                      Place type
                    </h3>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {types.map((t, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setType(t.name)}
                          className={`flex items-center justify-between p-3 rounded-xl border transition ${
                            type === t.name
                              ? "border-amber-300 bg-amber-50/30 shadow"
                              : "border-gray-100 hover:shadow-sm"
                          }`}
                        >
                          <div>
                            <div className="font-medium text-gray-800">
                              {t.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {t.description}
                            </div>
                          </div>
                          <div className="text-2xl">{t.icon}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mt-6 grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">
                        Street address
                      </label>
                      <input
                        name="streetAddress"
                        value={formLocation.streetAddress}
                        onChange={handleChangeLocation}
                        className="mt-2 w-full rounded-xl border-gray-200 p-3 outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="123 Palm Avenue"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">
                          Apartment, suite (optional)
                        </label>
                        <input
                          name="apartment"
                          value={formLocation.apartment}
                          onChange={handleChangeLocation}
                          className="mt-2 w-full rounded-xl border-gray-200 p-3"
                          placeholder="Unit, Floor"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-600">City</label>
                        <input
                          name="city"
                          value={formLocation.city}
                          onChange={handleChangeLocation}
                          className="mt-2 w-full rounded-xl border-gray-200 p-3"
                          placeholder="City"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">
                          Province
                        </label>
                        <input
                          name="province"
                          value={formLocation.province}
                          onChange={handleChangeLocation}
                          className="mt-2 w-full rounded-xl border-gray-200 p-3"
                          placeholder="State / Province"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Country</label>
                        <input
                          name="country"
                          value={formLocation.country}
                          onChange={handleChangeLocation}
                          className="mt-2 w-full rounded-xl border-gray-200 p-3"
                          placeholder="Country"
                          required
                        />
                      </div>
                    </div>

                    {/* Basics counters */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full min-w-0">
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
                </div>

                {/* STEP 2 - Amenities & Photos */}
                <div className="rounded-2xl border border-gray-100 p-6 bg-gray-50/60">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-medium text-gray-800">
                        2. Make your place stand out
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Select amenities and upload high quality photos.
                      </p>
                    </div>
                    <div className="text-sm text-gray-400">Step 2</div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {facilities.map((fac, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleFacilityClick(fac.name)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition ${
                          amenities.includes(fac.name)
                            ? "border-amber-300 bg-amber-50/30 shadow"
                            : "border-gray-100 hover:shadow-sm"
                        }`}
                      >
                        <div className="text-2xl">{fac.icon}</div>
                        <div className="text-xs text-gray-700">{fac.name}</div>
                      </button>
                    ))}
                  </div>

                  {/* Photos */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700">
                      Photos
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Drag to reorder. High quality photos get more views. (max
                      12)
                    </p>

                    <div className="mt-4">
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleUploadPhotos}
                        className="hidden"
                      />

                      <DragDropContext onDragEnd={handleDragPhoto}>
                        <Droppable droppableId="photos" direction="horizontal">
                          {(provided) => (
                            <div
                              className="flex gap-4 items-start overflow-x-auto py-2"
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {photos.map((photo, i) => (
                                <Draggable
                                  key={photo.name + i}
                                  draggableId={photo.name + i}
                                  index={i}
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
                                        alt={`preview-${i}`}
                                        className="w-48 h-32 object-cover rounded-xl shadow-md border"
                                      />
                                      <button
                                        onClick={() => handleRemovePhoto(i)}
                                        type="button"
                                        className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  )}
                                </Draggable>
                              ))}

                              {/* Upload card */}
                              <div
                                onClick={() => fileRef.current?.click()}
                                className="w-48 h-32 rounded-xl border-dashed border-2 border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                              >
                                <div className="flex flex-col items-center">
                                  <IoMdPhotos className="text-3xl text-gray-600" />
                                  <div className="text-sm text-gray-600 mt-2">
                                    Upload
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    JPEG, PNG
                                  </div>
                                </div>
                              </div>

                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
                  </div>
                </div>

                {/* Description & Price */}
                <div className="rounded-2xl border border-gray-100 p-6 bg-white">
                  <h2 className="text-lg font-medium text-gray-800">
                    3. Story & price
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Make guests fall in love with a short, punchy title and an
                    elegant description.
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-4">
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
                      textarea
                      rows={5}
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
                      textarea
                      rows={3}
                    />

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <BsCurrencyRupee />
                        <input
                          name="price"
                          type="number"
                          value={formDescription.price}
                          onChange={handleChangeDescription}
                          placeholder="1000"
                          className="w-40 rounded-xl p-3 border-gray-200 outline-none focus:ring-2 focus:ring-amber-200"
                          required
                        />
                      </div>

                      <div className="text-sm text-gray-500">
                        Price per night
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl text-white font-semibold shadow-md"
                    style={{
                      background: "linear-gradient(90deg,#B8860B,#D4AF37)",
                    }}
                  >
                    Publish Listing
                  </button>
                </div>
              </form>
            </section>

            {/* RIGHT - Summary Card */}
            <aside className="w-full lg:w-1/3 p-8 bg-gradient-to-b from-white/90 to-amber-50 border-l border-amber-50">
              <div className="sticky top-28">
                <div className="rounded-2xl p-6 border shadow-sm bg-white">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Listing preview
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    A compact preview of what guests will see.
                  </p>

                  <div className="mt-4">
                    <div className="rounded-lg overflow-hidden w-full h-48 bg-gray-100 flex items-center justify-center">
                      {photos[0] ? (
                        <img
                          src={URL.createObjectURL(photos[0])}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400">No photo yet</div>
                      )}
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-gray-800">
                        {formDescription.title || "Your beautiful place"}
                      </h4>
                      <div className="text-sm text-gray-500 mt-1">
                        {formLocation.city
                          ? `${formLocation.city}, ${formLocation.country}`
                          : "Location"}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm text-gray-600">Guests</div>
                        <div className="text-sm font-medium">{guestCount}</div>
                      </div>

                      <div className="mt-3 border-t pt-3">
                        <div className="text-xs text-gray-500">Amenities</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {amenities.length ? (
                            amenities.slice(0, 6).map((a, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 rounded-md bg-amber-50/60 border border-amber-100"
                              >
                                {a}
                              </span>
                            ))
                          ) : (
                            <div className="text-xs text-gray-400">
                              No amenities selected
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 text-right">
                      <div className="text-sm text-gray-500">
                        Estimated price
                      </div>
                      <div
                        className="text-2xl font-semibold"
                        style={{ color: "#6b4e07" }}
                      >
                        ₹ {formDescription.price || "—"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-sm text-gray-500">
                  <p>
                    Tip: Use 6–12 high-resolution photos — exteriors, living
                    areas, bedroom, kitchen, and a hero shot.
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="w-full py-2 rounded-lg border border-amber-200"
                  >
                    Back to top
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
