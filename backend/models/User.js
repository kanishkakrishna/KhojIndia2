// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  coins: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt fields
});

module.exports = mongoose.model("User", userSchema);
