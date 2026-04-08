// models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // Yeh Foreign Key hai jo Sthan collection (Place model) se jhudegi
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place", 
      required: true,
    },
    // Kisne comment kiya
    userName: {
      type: String,
      required: true,
      default: "Anonymous Yatri"
    },
    userEmail: {
      type: String,
      required: true,
    },
    // Asli Review
    comment: {
      type: String,
      required: true,
    }
  },
  { timestamps: true } // Yeh apne aap createdAt date daal dega
);

// Mongoose ko humne strictly bol diya ki collection ka naam 'reviews' rakhna
module.exports = mongoose.model("Review", reviewSchema, "reviews");