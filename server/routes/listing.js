const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const {
  createListing,
  getListing,
  getListingDetails,
} = require("../controllers/listing");

router.post(
  "/create-listing",
  upload.array("listingPhotos", 20),
  createListing
);
router.get("/get-listing", getListing);
router.get("/get-listing/:listingId", getListingDetails);

module.exports = router;
