const Place = require("../models/Place");
const User = require("../models/User");
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

    const {
      state,
      district,
      localName,
      nearbyLandmark,
      nearbyDhabas,
      nearbyLodges,
      guideInfo,
      weather,
      note,
    } = req.body;

    let mediaUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "khojindia",
      });
      mediaUrl = result.secure_url;

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } else {
      console.warn("⚠️ No file uploaded in request");
    }

    const userEmail = req.user?.email || "anonymous";

    const newPlace = new Place({
      state,
      district,
      localName,
      nearbyLandmark,
      nearbyDhabas,
      nearbyLodges,
      guideInfo,
      weather,
      note,
      mediaUrl,
      contributorEmail: userEmail,
    });

    await newPlace.save();

    // ✅ Increment user's coins by 1, if user exists
    const user = await User.findOne({ email: userEmail });

    if (user) {
      user.coins = (user.coins || 0) + 1;
      await user.save();
      console.log(`🪙 Coin incremented. Total coins: ${user.coins}`);
    } else {
      console.warn(`❗ User with email ${userEmail} not found. Coin not incremented.`);
    }

    res.status(201).json({
      message: "Place added successfully",
      place: newPlace,
    });
  } catch (err) {
    console.error("🔥 Error while adding place:", err);
    res.status(500).json({ error: "Server error while adding place" });
  }
};

// GET: search places by query
const searchPlaces = async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res
        .status(400)
        .json({ error: "Query parameter is required" });
    }

    const regex = new RegExp(query, "i");

    const results = await Place.find({
      $or: [
        { state: regex },
        { district: regex },
        { localName: regex },
      ],
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Server error while searching places" });
  }
};

module.exports = {
  getPlaces,
  addPlace,
  searchPlaces,
};
