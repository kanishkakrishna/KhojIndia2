// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Sahi CORS Setup (Local aur Live dono ke liye)
const corsOptions = {
  // Agar env mein link hai toh wo use karo, warna local testing ke liye sabko allow kar do '*'
  origin: process.env.FRONTEND_URL || '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Agar cookies/tokens bhej raha hai toh ye zaroori hai
};
app.use(express.json()); // JSON data parse karne ke liye
app.use(express.urlencoded({ extended: true }));

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ✅ API Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);

const placeRoutes = require("./routes/placeRoutes");
app.use("/api", placeRoutes); 

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/api/ping", (req, res) => res.json({ ok: true }));

// ✅ Start server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});