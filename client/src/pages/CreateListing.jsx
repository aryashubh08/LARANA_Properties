import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TextInput from "../components/TextInput";
import CounterBox from "../components/CounterBox";
import { categories, facilities, types } from "../data";
import { IoMdPhotos } from "react-icons/io";
import { BsCurrencyRupee } from "react-icons/bs";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateListing() {
  const navigate = useNavigate();
  const creatorId = useSelector((s) => s.user?._id);

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
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    setPhotos((prev) => [...prev, ...imageFiles].slice(0, 12));
    e.target.value = null;
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;
    const items = Array.from(photos);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setPhotos(items);
  };

  const handleRemovePhoto = (index) => {
    setPhotos((p) => p.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!category) return "Please select a category";
    if (!type) return "Please select a place type";
    if (!photos.length) return "Upload at least one photo";
    if (!formDescription.title || !formDescription.price)
      return "Title & Price are required";
    if (!formLocation.city || !formLocation.province || !formLocation.country)
      return "City, Province & Country required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    try {
      const fd = new FormData();
      fd.append("userId", creatorId);
      fd.append("category", category);
      fd.append("type", type);

      Object.entries(formLocation).forEach(([k, v]) => fd.append(k, v));
      Object.entries(formDescription).forEach(([k, v]) => fd.append(k, v));

      fd.append("guestCount", guestCount);
      fd.append("bedroomCount", bedroomCount);
      fd.append("bedCount", bedCount);
      fd.append("bathroomCount", bathroomCount);
      fd.append("amenities", JSON.stringify(amenities));

      photos.forEach((p) => fd.append("listingPhotos", p));

      const loading = toast.loading("Publishing listing...");
      const res = await fetch(
        "https://larana-properties-server.vercel.app/api/v1/creator/create-listing",
        { method: "POST", body: fd }
      );
      toast.dismiss(loading);

      if (res.ok) {
        toast.success("Listing published!");
        navigate("/");
      } else {
        toast.error("Failed to publish listing");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-28 pb-20">
        <div className="bg-white  rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex justify-center">
            <section className="w-full max-w-4xl p-4">
              <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                Publish your luxury listing
              </h1>
              <p className="text-sm text-gray-500 mb-8">
                Premium presentation for premium properties
              </p>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* STEP 1 */}
                <div className="rounded-2xl border p-6 bg-white">
                  <h2 className="text-lg font-medium mb-4">
                    1. Tell us about your place
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {categories.map((cat, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCategory(cat.label)}
                        className={`p-4 rounded-xl border ${
                          category === cat.label
                            ? "border-amber-400 bg-amber-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="text-2xl">{cat.icon}</div>
                        <div className="text-sm mt-2">{cat.label}</div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {types.map((t, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setType(t.name)}
                        className={`p-4 border rounded-xl ${
                          type === t.name
                            ? "border-amber-400 bg-amber-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="font-medium">{t.name}</div>
                        <div className="text-xs text-gray-500">
                          {t.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* STEP 2 */}
                <div className="rounded-2xl border p-6 bg-gray-50">
                  <h2 className="text-lg font-medium mb-4">
                    2. Amenities & Photos
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {facilities.map((f, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleFacilityClick(f.name)}
                        className={`p-3 border rounded-xl ${
                          amenities.includes(f.name)
                            ? "border-amber-400 bg-amber-50"
                            : "border-gray-200"
                        }`}
                      >
                        {f.icon}
                        <div className="text-xs mt-1">{f.name}</div>
                      </button>
                    ))}
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={handleUploadPhotos}
                  />

                  <DragDropContext onDragEnd={handleDragPhoto}>
                    <Droppable droppableId="photos" direction="horizontal">
                      {(p) => (
                        <div
                          ref={p.innerRef}
                          {...p.droppableProps}
                          className="flex gap-4 mt-6 overflow-x-auto"
                        >
                          {photos.map((photo, i) => (
                            <Draggable
                              key={photo.name + i}
                              draggableId={photo.name + i}
                              index={i}
                            >
                              {(d) => (
                                <div
                                  ref={d.innerRef}
                                  {...d.draggableProps}
                                  {...d.dragHandleProps}
                                  className="relative"
                                >
                                  <img
                                    src={URL.createObjectURL(photo)}
                                    className="w-40 h-28 rounded-xl object-cover"
                                  />
                                  <button
                                    onClick={() => handleRemovePhoto(i)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6"
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}

                          <div
                            onClick={() => fileRef.current.click()}
                            className="w-40 h-28 border-dashed border flex items-center justify-center rounded-xl cursor-pointer"
                          >
                            <IoMdPhotos className="text-2xl" />
                          </div>
                          {p.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>

                {/* STEP 3 */}
                <div className="rounded-2xl border p-6 bg-white">
                  <h2 className="text-lg font-medium mb-4">
                    3. Description & Price
                  </h2>

                  <TextInput
                    label="Title"
                    name="title"
                    value={formDescription.title}
                    onChange={handleChangeDescription}
                  />

                  <TextInput
                    label="Description"
                    textarea
                    rows={4}
                    name="description"
                    value={formDescription.description}
                    onChange={handleChangeDescription}
                  />

                  <div className="flex items-center gap-2 mt-4">
                    <BsCurrencyRupee />
                    <input
                      name="price"
                      type="number"
                      value={formDescription.price}
                      onChange={handleChangeDescription}
                      className="border rounded-xl p-3 w-40"
                      placeholder="1000"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl text-white font-semibold"
                  style={{
                    background: "linear-gradient(90deg,#B8860B,#D4AF37)",
                  }}
                >
                  Publish Listing
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
