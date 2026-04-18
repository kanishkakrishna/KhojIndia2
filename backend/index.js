// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Sahi CORS Setup (Local aur Live dono ke liye)
app.use(cors({
  origin: [
    'http://127.0.0.1:3000',
    'http://localhost:3000', // Agar CRA (React) use kar rahe ho
    'http://localhost:5173',
    'http://127.0.0.1:5173', // Agar Vite use kar rahe ho
    'http://127.0.0.1:5174',
    'http://localhost:5174',
    'https://khojindia2.netlify.app' // Tumhari live website
  ],
  credentials: true,
}));

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