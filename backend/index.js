// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // for parsing JSON body
app.use(cors({
  origin: 'https://khojindia2.netlify.app',
  credentials: true, // if you're using cookies/auth
}));
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

app.get("/api/ping", (req, res) => res.json({ ok: true }));

// ✅ Start server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
