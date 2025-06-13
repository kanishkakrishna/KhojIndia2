// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // for parsing JSON body
app.use(express.urlencoded({ extended: true }));

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);

// ✅ Import and use your placeRoutes
const placeRoutes = require("./routes/placeRoutes");
app.use("/api", placeRoutes); // ⬅️ This means routes will start with /api

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// ✅ Start server
const PORT = 9000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
