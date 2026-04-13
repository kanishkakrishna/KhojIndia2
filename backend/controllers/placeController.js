const Place = require("../models/Place");
const User = require("../models/User");
const Review = require("../models/Review");
const cloudinary = require('../config/cloudinary');
const fs = require("fs");

// GET: fetch all places
const getPlaces = async (req, res) => {
  try {
    const places = await Place.find({});
    res.status(200).json({ places });
  } catch (err) {
    res.status(500).json({ error: "Error fetching places" });
  }
};

// POST: add a new place
const addPlace = async (req, res) => {
  try {
    console.log("📥 Body:", req.body);
    console.log("📁 File:", req.file);
    console.log("👤 User from token:", req.user);

    // 1. Sirf Zaroori Fields Nikale
    const { state, district, localName, description } = req.body;

    // 2. Photo Required Check
    if (!req.file) {
      return res.status(400).json({ error: "Photo is required. Please upload an image." });
    }

    // 3. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "khojindia",
    });
    const mediaUrl = result.secure_url;

    // 4. Local file delete karo
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // ✅ 5. User Details nikalo (Ab token se asli naam aayega!)
    const userEmail = req.user?.email || "anonymous";
    const userName = req.user?.name || req.user?.username || "Anonymous Yatri"; // 👈 Yahan update kiya hai

    // 6. Naya Place Object Banao
    const newPlace = new Place({
      state,
      district,
      localName,
      description,
      mediaUrl,
      contributedBy: userName, // 👈 Yahan update hoga
      contributorEmail: userEmail,
      // hashtags: [] -> AI wala code baad mein yahan aayega!
    });

    await newPlace.save();

    // 7. Increment user's coins
    const user = await User.findOne({ email: userEmail });
    if (user) {
      user.coins = (user.coins || 0) + 1;
      await user.save();
      console.log(`🪙 Coin incremented. Total coins: ${user.coins}`);
    } else {
      console.warn(`❗ User with email ${userEmail} not found. Coin not incremented.`);
    }

    res.status(201).json({
      message: "Place added successfully!",
      place: newPlace,
    });
  } catch (err) {
    console.error("🔥 Error while adding place:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Server error while adding place" });
  }
};

// GET: search places by query
const searchPlaces = async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const regex = new RegExp(query, "i");

    const results = await Place.find({
      $or: [
        { state: regex },
        { district: regex },
        { localName: regex },
        { description: regex },
      ],
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Server error while searching places" });
  }
};

// 1. Ek specific jagah ki detail nikalna (ID se)
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ error: "Place not found" });
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: "Invalid Place ID" });
  }
};

// ✅ 2. Naya review/comment save karna
const addReview = async (req, res) => {
  try {
    const { comment } = req.body;
    const newReview = new Review({
      placeId: req.params.id,
      comment,
      userName: req.user?.name || req.user?.username || "Anonymous Yatri", // 👈 Yahan update kiya hai
      userEmail: req.user?.email || "anonymous"
    });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: "Failed to add review" });
  }
};

// 3. Us jagah ke saare reviews nikalna
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ placeId: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

module.exports = { getPlaces, addPlace, searchPlaces, getPlaceById, addReview, getReviews };