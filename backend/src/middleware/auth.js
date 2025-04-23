const jwt = require("jsonwebtoken");
const User = require("../models/User");
const rateLimit = require("express-rate-limit");

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again after 15 minutes"
});

// Rate limiter for general API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later"
});

exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Access Denied. No token provided." 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ 
        success: false,
        message: "Token has expired. Please login again." 
      });
    }

    // Get user from database
    const user = await User.findById(decoded.userId).select("email _id address role isEmailVerified accountLocked accountLockedUntil");
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Check if account is locked
    if (user.accountLocked) {
      if (user.accountLockedUntil > Date.now()) {
        return res.status(403).json({
          success: false,
          message: "Account is locked. Please try again later."
        });
      } else {
        // Reset account lock if lock period has expired
        user.resetLoginAttempts();
        await user.save();
      }
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token" 
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        message: "Token has expired. Please login again." 
      });
    }

    res.status(500).json({ 
      success: false,
      message: "Internal server error during authentication" 
    });
  }
};

// Middleware to verify admin
exports.verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "Authentication required" 
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false,
        message: "Access Denied. Admins only." 
      });
    }

    next();
  } catch (error) {
    console.error("Admin Verification Error:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Server error during admin verification" 
    });
  }
};

// Middleware to verify lender
exports.verifyLender = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "Authentication required" 
      });
    }

    if (req.user.role !== "lender") {
      return res.status(403).json({ 
        success: false,
        message: "Access Denied. Lenders only." 
      });
    }

    next();
  } catch (error) {
    console.error("Lender Verification Error:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Server error during lender verification" 
    });
  }
};

// Middleware to verify renter
exports.verifyRenter = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "Authentication required" 
      });
    }

    if (req.user.role !== "renter") {
      return res.status(403).json({ 
        success: false,
        message: "Access Denied. Renters only." 
      });
    }

    next();
  } catch (error) {
    console.error("Renter Verification Error:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Server error during renter verification" 
    });
  }
};

// Export rate limiters
exports.authLimiter = authLimiter;
exports.apiLimiter = apiLimiter;

