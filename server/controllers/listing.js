const mongoose = require("mongoose");
const User = require("../models/User");
const Listing = require("../models/Listing"); // <-- Add your listing model
const imageKit = require("../config/imageKit"); // <-- same as previous
// Multer memory storage must be used in your route

exports.createListing = async (req, res) => {
  try {
    const {
      userId,
      category,
      type,
      streetAddress,
      apartment,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDetails,
      price,
    } = req.body;

    const listingPhotos = req.files;

    if (!listingPhotos || listingPhotos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Images are required",
      });
    }

    const uploadedPhotos = [];

    for (const photo of listingPhotos) {
      const fileBuffer = photo.buffer;

      const uploadResponse = await imageKit.upload({
        file: fileBuffer,
        fileName: photo.originalname,
        folder: "/listings",
      });

      const optimizedUrl = imageKit.url({
        src: uploadResponse.url,
        transformation: [
          {
            width: "1280",
            quality: "auto",
            format: "webp",
          },
        ],
      });

      uploadedPhotos.push(optimizedUrl);
    }

    const newListing = await Listing.create({
      creator: userId, // FIXED
      category,
      type,
      streetAddress,
      apartment,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities: JSON.parse(amenities || "[]"),
      title,
      description,
      highlight,
      highlightDetails,
      price,
      photos: uploadedPhotos,
    });

    return res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing: newListing,
    });
  } catch (error) {
    console.log("Error in createListing:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//GET LISTINGS

exports.getListing = async (req, res) => {
  const qCategory = req.query.category;
  try {
    let listings;
    if (qCategory) {
      listings = await Listing.find({ category: qCategory }).populate(
        "creator"
      );
    } else {
      listings = await Listing.find();
    }
    res.status(200).json({
      success: true,
      listings,
    });
  } catch (error) {
    console.log("Error in getting Listing:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
