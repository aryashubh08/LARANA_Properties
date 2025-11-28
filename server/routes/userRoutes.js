const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");

const { register, login } = require("../controllers/user");

router.post("/register", upload.single("profileImage"), register);
router.post("/login", login);

module.exports = router;
