const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 4400;

// Import routes
const userRoutes = require("./routes/userRoutes");
const listingRoutes = require("./routes/listing");
const bookingRoutes = require("./routes/bookingRoute");

// DB connection
const db = require("./config/connection");
db.connect();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());

// Mount routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/creator", listingRoutes);
app.use("/api/v1/bookings", bookingRoutes);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
