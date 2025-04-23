const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");
const { authenticateUser } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all rentals
router.get("/", authenticateUser, rentalController.getAllRentals);

// Get rental by ID
router.get("/:id", authenticateUser, rentalController.getRentalById);

// Rental routes
router.post("/create-listing", authenticateUser, upload.single("image"), rentalController.createListing);
router.post("/book", authenticateUser, rentalController.bookRental);
router.post("/complete", authenticateUser, rentalController.completeRental);
router.post("/cancel", authenticateUser, rentalController.cancelRental);
// router.post("/confirm-return", rentalController.confirmReturn);
router.post("/addPenalty", authenticateUser, rentalController.addPenalty);
module.exports = router;
