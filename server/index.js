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

// Allow your frontend origin and PATCH method
app.use(
  cors({
    origin: "https://larana-properties.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
