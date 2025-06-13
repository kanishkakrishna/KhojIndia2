const express = require("express");
const router = express.Router();
const { getPlaces, addPlace, searchPlaces } = require("../controllers/placeController");

const upload = require("../upload");
const validateState = require("../middlewares/validateState");
const checkDuplicate = require("../middlewares/checkDuplicate");
const verifyToken = require("../middlewares/verifyToken");

router.get("/places", getPlaces);
router.get("/search", searchPlaces);

router.post(
  "/contribute",
  verifyToken,                   
  upload.single("media"),
  validateState,
  checkDuplicate,
  addPlace
);

module.exports = router;
