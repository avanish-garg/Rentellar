const express = require("express");
const { register, login } = require("../controllers/authController");
const { authenticateUser } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateUser, async (req, res) => {
  try {
    // req.user is already populated by authenticateUser middleware
    res.json(req.user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
