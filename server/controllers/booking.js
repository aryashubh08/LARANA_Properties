const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } =
      req.body;

    const newBooking = await Booking.create({
      customerId,
      hostId,
      listingId,
      startDate,
      endDate,
      totalPrice,
    });

    return res.status(201).json({
      success: true,
      booking: newBooking,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Failed to create new Booking",
    });
  }
};
