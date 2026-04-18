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
    console.error("🔥 ASLI ERROR YAHAN HAI:", err); 
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

    // =====================================================================
    // 🕵️‍♂️ STEP 3A: THE AI BOUNCER CHECK (Genuine hai ya nahi?)
    // =====================================================================
    let generatedHashtags = [];
    try {
      console.log(`🚀 Checking with AI Security Bouncer for: ${localName}...`);
      
      const aiResponse = await fetch("http://127.0.0.1:8000/api/analyze-place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ localName, district, state, description })
      });

      const aiData = await aiResponse.json();
      console.log("👮‍♂️ AI Decision in Node:", aiData);

      // 🚨 AGAR BOUNCER NE REJECT KIYA:
      if (aiData.isApproved === false) {
        console.log(`❌ Place Rejected by AI: ${aiData.reason}`);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        
        return res.status(403).json({ 
          error: "Submission Rejected by AI Bouncer 🛑", 
          reason: aiData.reason 
        });
      }

      // ✅ Agar approve hua, toh tags save kar lo
      if (aiData.hashtags) {
        generatedHashtags = aiData.hashtags;
      }
    } catch (aiError) {
      console.error("❌ Bouncer Microservice Error:", aiError.message);
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(503).json({ 
        error: "Server Error: AI Bouncer abhi active nahi hai. Thodi der baad try karein." 
      });
    }

    // =====================================================================
    // ⚔️ STEP 3B: THE CLONE HUNTER (Duplicate Check Vector Search)
    // =====================================================================
    let placeEmbedding = []; // Naya vector save karne ke liye
    try {
      console.log(`🔍 Checking for clones using Vector Search for: ${localName}...`);
      
      const hunterResponse = await fetch("http://127.0.0.1:8000/api/check-duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: localName, 
          state: state, 
          description: description, 
          photo_tags: generatedHashtags 
        })
      });

      const hunterData = await hunterResponse.json();
      console.log("🎯 Clone Hunter Decision:", hunterData.status);

      // 🚨 AGAR HUNTER KO DUPLICATE MILA:
      if (hunterData.status === "REJECT") {
         console.log(`❌ Clone detected by AI! Matches with: ${hunterData.duplicate_of}`);
         if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
         
         return res.status(409).json({ 
            error: "Arre boss, yeh jagah already KhojIndia par hai!",
            duplicate_of: hunterData.duplicate_of,
            similarity: hunterData.similarity_score
         });
      }

      // ✅ Agar safe hai, toh naya vector extract kar lo
      if (hunterData.status === "ACCEPT" && hunterData.new_vector) {
         placeEmbedding = hunterData.new_vector;
      }
    } catch (hunterError) {
      console.error("❌ Hunter Microservice Error:", hunterError.message);
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(503).json({ 
        error: "Server Error: AI Clone Hunter abhi offline hai. Thodi der baad try karein." 
      });
    }

    // =====================================================================
    // ☁️ STEP 4: Upload to Cloudinary & Save to MongoDB
    // =====================================================================
    console.log("✅ AI Approved and No Clones! Uploading image to Cloudinary...");
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "khojindia",
    });
    const mediaUrl = result.secure_url;

    // 5. Local file delete karo
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    // 6. User Details nikalo 
    const userEmail = req.user?.email || "anonymous";
    const userName = req.user?.name || req.user?.username || "Anonymous Yatri";

    // 7. Naya Place Object Banao
    const newPlace = new Place({
      state,
      district,
      localName,
      description,
      mediaUrl,
      contributedBy: userName, 
      contributorEmail: userEmail,
      hashtags: generatedHashtags, 
      embedding: placeEmbedding
    });

    await newPlace.save();

    // 8. Increment user's coins
    const user = await User.findOne({ email: userEmail });
    if (user) {
      user.coins = (user.coins || 0) + 1;
      await user.save();
      console.log(`🪙 Coin incremented. Total coins: ${user.coins}`);
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
      userName: req.user?.name || req.user?.username || "Anonymous Yatri", 
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

// ✅ 4. AI VIBE CHECKER
const getPlaceVibe = async (req, res) => {
  try {
    const placeId = req.params.id;
    
    // 1. Database se is jagah ke saare reviews nikalo
    const reviews = await Review.find({ placeId });
    
    if (reviews.length === 0) {
      return res.json({ vibe: "No reviews yet. Be the first to share your experience!" });
    }

    // 2. Sirf comments ka array banao (e.g., ["Mast jagah hai", "Road kharab hai"])
    const reviewTexts = reviews.map(r => r.comment);

    console.log(`🤖 Sending ${reviewTexts.length} reviews to AI for Vibe Check...`);

    // 3. Python Microservice ko call lagao
    const aiResponse = await fetch("http://127.0.0.1:8000/api/summarize-reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviews: reviewTexts })
    });

    const aiData = await aiResponse.json();
    console.log("🔍 Python Bouncer Response:", aiData);
    console.log("✨ AI Vibe Received:", aiData.vibe);

    // 4. Frontend ko Vibe bhej do
    res.json({ vibe: aiData.vibe });

  } catch (error) {
    console.error("❌ Error generating vibe:", error);
    res.status(500).json({ error: "Failed to generate AI Vibe" });
  }
};

// =====================================================================
// ✅ 5. KHOJINDIA AI TRIP PLANNER (Naya Function Yahan Hai!)
// =====================================================================
const generateAIPlan = async (req, res) => {
  try {
    const { prompt } = req.body; 

    if (!prompt) {
      return res.status(400).json({ error: "Bhai, kuch prompt toh do!" });
    }

    console.log(`🤖 Generating AI Trip Plan for prompt: "${prompt}"...`);

    // Python FastAPI ko call maar rahe hain (Using standard 'fetch')
    const aiResponse = await fetch("http://127.0.0.1:8000/api/plan-trip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: prompt })
    });

    const responseData = await aiResponse.json();
    
    // FastAPI humein { status: 'success', data: {...} } bhej raha hai
    if (responseData.status === "success") {
      console.log("✨ AI Plan Successfully Received and Sent to Frontend!");
      return res.status(200).json(responseData.data); // JSON frontend ko gaya
    } else {
      throw new Error(responseData.message || "Python script se error aaya hai");
    }

  } catch (error) {
    console.error("❌ AI Service Error:", error.message);
    res.status(500).json({ 
      error: "AI Planner thoda thak gaya hai, baad mein try karo!",
      details: error.message 
    });
  }
};

// module.exports mein naya function add kar diya hai
module.exports = { 
    getPlaces, 
    addPlace, 
    searchPlaces, 
    getPlaceById, 
    addReview, 
    getReviews, 
    getPlaceVibe, 
    generateAIPlan
};