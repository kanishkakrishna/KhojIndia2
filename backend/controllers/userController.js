// controllers/userController.js

const User = require("../models/User");

// GET: Leaderboard sorted by highest coins
const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ coins: -1 })                   // Descending order of coins
      .select("username email coins");       // Select only required fields

    res.status(200).json({ leaderboard: topUsers });
  } catch (err) {
    console.error("🔥 Error fetching leaderboard:", err);
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
};

module.exports = {
  getLeaderboard,
};
