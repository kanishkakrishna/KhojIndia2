const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Signup (Isme koi change nahi kiya hai)
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
};

// Login (✅ Yahan token ko update kiya hai)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // ✅ NAYA TOKEN LOGIC: Ab isme id, username aur email teeno jayenge
    const token = jwt.sign(
      { 
        id: user._id, 
        name: user.username, // Tumhara field 'username' hai, usko 'name' key mein daal rahe hain
        email: user.email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" } // 1h se badha kar 7d kar diya, baar baar login nahi karna padega
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { signup, login };