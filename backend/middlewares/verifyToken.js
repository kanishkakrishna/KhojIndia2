const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  // Check if token exists and starts with Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token and extract user info (email, id etc.)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // This gives you access to email, id, etc. in the next middleware
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." }); // Use 403 for invalid token
  }
};
