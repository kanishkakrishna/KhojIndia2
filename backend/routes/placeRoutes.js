const express = require("express");
const router = express.Router();
const { 
  getPlaces, 
  addPlace, 
  searchPlaces,
  getPlaceById, // Naya import
  addReview,    // Naya import
  getReviews,   // Naya import
  getPlaceVibe
} = require("../controllers/placeController");

const upload = require("../upload");
const validateState = require("../middlewares/validateState");
const checkDuplicate = require("../middlewares/checkDuplicate");
const verifyToken = require("../middlewares/verifyToken");

// --- Pehle wale Routes ---
router.get("/places", getPlaces);
router.get("/search", searchPlaces);

// --- Naye Phase 2 Routes (Dynamic & Reviews) ---
router.get("/places/:id", getPlaceById);               // 1. Ek jagah ki detail laane ke liye
router.get("/places/:id/reviews", getReviews);         // 2. Us jagah ke saare reviews laane ke liye
router.post("/places/:id/reviews", verifyToken, addReview); // 3. Naya review daalne ke liye (Login zaroori hai)

// Phir apne routes mein ek naya line add karo (Contribute route se pehle)
router.get("/places/:id/vibe", getPlaceVibe); // 👈 Naya AI Vibe Route

// --- Contribute Route ---
router.post(
  "/contribute",
  verifyToken,                   
  upload.single("media"),
  validateState,
  checkDuplicate,
  addPlace
);

module.exports = router;