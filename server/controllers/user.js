const Booking = require("../models/Booking");

exports.getTrips = async (req, res) => {
  try {
    const { userId } = req.params;
    const trips = await Booking.find({ customerId: userId }).populate(
      "customerId hostId listingId"
    );
    return res.status(200).json({
      success: false,
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
