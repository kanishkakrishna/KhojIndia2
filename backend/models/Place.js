const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  state: String,
  district: String,
  localName: String,
  nearbyLandmark: String,
  nearbyDhabas: [String],
  nearbyLodges: [String],
  guideInfo: String,
  weather: String,
  note: String,
  mediaUrl: String,
  contributedBy: String, // (optional: could be username/display name)
  contributorEmail: {
    type: String,
    required: true,
  },
  coins: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("Place", placeSchema);
