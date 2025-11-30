const User = require("../models/User.js");
const imageKit = require("../config/imageKit.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Fill all the required fields",
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const profileImage = req.file;

    // Use buffer directly (memory storage)
    const fileBuffer = profileImage.buffer;

    // Upload to ImageKit
    const response = await imageKit.upload({
      file: fileBuffer,
      fileName: profileImage.originalname,
      folder: "/user",
    });

    // Optimized URL
    const optimizedImageUrl = imageKit.url({
      src: response.url,
      transformation: [
        {
          width: "1280",
          quality: "auto",
          format: "webp",
        },
      ],
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagePath: optimizedImageUrl,
    });

    res.status(201).json({
      success: true,
      message: "user registered successfully",
      user,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exists!",
      });
    }
    //compare the password with the hashed password
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials!",
      });
    }
    //generate jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    user.password = undefined;
    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration",
      error: error.message,
    });
  }
};
