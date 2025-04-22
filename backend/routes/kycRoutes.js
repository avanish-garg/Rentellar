const express = require("express");
const router = express.Router();
const kycController = require("../controllers/kycController");
const { authenticateUser } = require("../middleware/auth");
const { verifyAdmin } = require("../middleware/auth");
const multer = require("multer");

// Configure Multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Route for uploading KYC document (Protected)
router.post("/upload", authenticateUser, upload.single("document"), kycController.uploadKYC);
router.put("/verify/:id", authenticateUser, verifyAdmin, kycController.verifyKYC); // Admin verifies KYC
module.exports = router;
