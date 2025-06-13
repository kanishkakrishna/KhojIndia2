const Place = require("../models/Place");

module.exports = async function checkDuplicate(req, res, next) {
  const { state, district, localName } = req.body;

  try {
    const existingPlace = await Place.findOne({
      state,
      district,
      localName
    });

    if (existingPlace) {
      return res.status(409).json({ error: "Place already exists" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: "Server error while checking duplicates" });
  }
};
