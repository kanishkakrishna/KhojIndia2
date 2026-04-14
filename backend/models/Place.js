const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  state: { type: String, required: true },
  district: { type: String, required: true },
  localName: { type: String, required: true },
  
  description: { 
    type: String, 
    required: [true, "Description is required."],
    minLength: [50, "Please provide more details. Description must be at least 50 characters long."],
    maxLength: [1000, "Description is too long. Please keep it under 1000 characters."]
  },
  
  // Isme bhi custom English message daal diya hai
  mediaUrl: { 
    type: String, 
    required: [true, "Photo is required. Please upload an image."] 
  },
  
 hashtags: {
    type: [String],
    default: []
  },

  contributedBy: String, 
  contributorEmail: {
    type: String,
    required: [true, "Email is required to verify the upload."],
  },
  coins: {
    type: Number,
    default: 1,
  },
}, { timestamps: true }); 

module.exports = mongoose.model("Place", placeSchema, "Sthan");