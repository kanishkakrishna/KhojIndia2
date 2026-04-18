const express = require("express");
const router = express.Router();
const { 
  getPlaces, 
  addPlace, 
  searchPlaces,
  getPlaceById, 
  addReview,    
  getReviews,   
  getPlaceVibe,
  generateAIPlan // 👈 Ye add kar diya import mein!
} = require("../controllers/placeController");

const upload = require("../upload");
const validateState = require("../middlewares/validateState");
// const checkDuplicate = require("../middlewares/checkDuplicate"); // 👈 Ise comment kar diya/hata diya, AI apna kaam karega
const verifyToken = require("../middlewares/verifyToken");

// --- Pehle wale Routes ---
router.get("/places", getPlaces);
router.get("/search", searchPlaces);

// --- Naye Phase 2 Routes (Dynamic & Reviews) ---
router.get("/places/:id", getPlaceById);               
router.get("/places/:id/reviews", getReviews);         
router.post("/places/:id/reviews", verifyToken, addReview); 

// --- Generate planned by AI ---
router.post('/plan-trip', generateAIPlan); // 👈 Yahan se 'placeController.' hata diya

// --- AI Vibe Route ---
router.get("/places/:id/vibe", getPlaceVibe); 

// --- Contribute Route ---
router.post(
  "/contribute",
  verifyToken,                   
  upload.single("media"),
  validateState,
  // checkDuplicate hata diya yahan se
  addPlace
);

module.exports = router;