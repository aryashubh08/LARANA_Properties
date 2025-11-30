const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");

const { getTrips } = require("../controllers/user");
const { register, login } = require("../controllers/auth");

router.post("/register", upload.single("profileImage"), register);
router.post("/login", login);
router.post("/:userId/trips", getTrips);

module.exports = router;
