const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");

const {
  getTrips,
  addToWishList,
  getPropertyList,
  getReservationList,
} = require("../controllers/user");
const { register, login } = require("../controllers/auth");

router.post("/register", upload.single("profileImage"), register);
router.post("/login", login);
router.get("/:userId/trips", getTrips);
router.get("/:userId/propertyList", getPropertyList);
router.get("/:userId/reservationList", getReservationList);
router.post("/:userId/:listingId", addToWishList);

module.exports = router;
