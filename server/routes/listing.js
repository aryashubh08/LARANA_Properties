const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const { createListing, getListing } = require("../controllers/listing");

router.post(
  "/create-listing",
  upload.array("listingPhotos", 20),
  createListing
);
router.get("/get-listing", getListing);

module.exports = router;
