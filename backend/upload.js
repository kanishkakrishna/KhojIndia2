const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./config/cloudinary");

// Configure storage to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "KhojIndia", // Optional: name of folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "mov"],
  },
});

// Create multer upload middleware
const upload = multer({ storage });

module.exports = upload;
