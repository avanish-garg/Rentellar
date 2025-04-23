const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Register User Function
const register = async (req, res) => {
  try {
    const { name, email, username, password, address,role } = req.body;

    // Validate required fields
    if (!name || !email || !username ||!role|| !password  || !address) {
      return res.status(400).json({ error: "All fields are required, including blockchain address." });
    }

    // Check if email or username already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email or Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with blockchain address
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
      address,
      role, // Add blockchain address
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("❌ Error registering user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Login User Function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Ensure JWT_SECRET is loaded
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in .env");
    }

    const token = jwt.sign({ userId: user._id, role: user.role, address: user.address }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return user data without sensitive information
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      username: user.username
    };

    res.status(200).json({ 
      message: "Login successful", 
      token,
      user: userData
    });
  } catch (error) {
    console.error("❌ Error logging in:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { register, login };