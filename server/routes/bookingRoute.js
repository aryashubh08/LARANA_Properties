const express = require("express");
const { createBooking } = require("../controllers/booking");
const router = express.Router();

router.post("/create-booking", createBooking);
module.exports = router;
