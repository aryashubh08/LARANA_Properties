const Booking = require("../models/Booking");
const User = require("../models/User");
const Listing = require("../models/Listing");

exports.getTrips = async (req, res) => {
  try {
    const { userId } = req.params;
    const trips = await Booking.find({ customerId: userId }).populate(
      "customerId hostId listingId"
    );
    return res.status(200).json({
      success: true,
      trips,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Can not find trips",
    });
  }
};

//Add listing to wishList

exports.addToWishList = async (req, res) => {
  try {
    const { userId, listingId } = req.params;

    const user = await User.findById(userId).populate("wishList");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const listing = await Listing.findById(listingId).populate("creator");
    if (!listing)
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });

    const alreadyLiked = user.wishList.some(
      (item) => item?._id?.toString() === listingId.toString()
    );

    if (alreadyLiked) {
      // Remove from wishlist
      user.wishList = user.wishList.filter(
        (item) => item?._id?.toString() !== listingId.toString()
      );
    } else {
      // Add to wishlist
      user.wishList.push(listing);
    }

    await user.save();

    // Return populated wishlist
    const populatedUser = await User.findById(userId).populate({
      path: "wishList",
      populate: {
        path: "creator",
        model: "User",
      },
    });

    res.status(200).json({
      success: true,
      isLiked: !alreadyLiked,
      wishList: populatedUser.wishList,
      message: alreadyLiked
        ? "Listing removed from wishlist"
        : "Listing added to wishlist",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//GET PROPERTY LIST
exports.getPropertyList = async (req, res) => {
  try {
    const { userId } = req.params;
    const properties = await Listing.find({ creator: userId }).populate(
      "creator"
    );
    res.status(200).json({
      success: true,
      properties,
    });
  } catch (error) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//GET RESERVATION LIST
exports.getReservationList = async (req, res) => {
  try {
    const { userId } = req.params;
    const reservation = await Booking.find({ hostId: userId }).populate(
      "customerId hostId listingId"
    );
    return res.status(200).json({
      success: true,
      reservation,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Can not find reservation",
    });
  }
};
