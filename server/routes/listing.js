const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const {
  createListing,
  getListing,
  getListingDetails,
  getListingBySearch,
} = require("../controllers/listing");

router.post(
  "/create-listing",
  upload.array("listingPhotos", 20),
  createListing
);
router.get("/get-listing", getListing);
router.get("/get-listing/:listingId", getListingDetails);
router.get("/get-listing/search/:search", getListingBySearch);

module.exports = router;
