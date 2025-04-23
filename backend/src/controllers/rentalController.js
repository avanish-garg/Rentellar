const { AptosClient, AptosAccount } = require("aptos");
const Rental = require("../models/Rental");
const sendOTPEmail = require("../config/emailConfig");
const otpGenerator = require("otp-generator");
require("dotenv").config({ path: "./.env" });
const sendTransaction = require("../utils/sendTransaction");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { sendOTP } = require("../utils/emailService");
const { generateOTP } = require("../utils/otpService");

// Initialize Aptos client
const APTOS_NODE_URL = process.env.APTOS_NODE_URL;
const client = new AptosClient(APTOS_NODE_URL);

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
exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ status: "Created" });
    res.status(200).json({ rentals });
  } catch (error) {
    console.error("Error fetching rentals:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get rental by ID
exports.getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findOne({ tokenId: req.params.id });
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found"
      });
    }
    res.status(200).json({
      success: true,
      rental
    });
  } catch (error) {
    console.error("Error fetching rental:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching rental",
      error: error.message
    });
  }
};

// Create new rental listing
exports.createListing = async (req, res) => {
  try {
    const {
      name,
      description,
      rentAmount,
      deposit,
      category,
      condition,
      location,
      availableQuantity,
      ownerAddress
    } = req.body;

    // Validate owner address format
    if (!ownerAddress || !ownerAddress.startsWith("0x")) {
      return res.status(400).json({
        success: false,
        message: "Invalid owner address format. Must start with '0x'"
      });
    }

    // Validate image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image"
      });
    }

    // Create rental listing on blockchain
    const blockchainResponse = await sendTransaction("create_rental", [
      ownerAddress,
      rentAmount.toString(),
      deposit.toString(),
      description,
      name,
      category,
      condition,
      location,
      availableQuantity.toString()
    ]);

    // Save to MongoDB with blockchain transaction hash
    const newRental = new Rental({
      name,
      description,
      rentAmount,
      deposit,
      category,
      condition,
      location,
      availableQuantity,
      owner: ownerAddress,
      image: req.file.path,
      blockchainTxHash: blockchainResponse.txHash
    });

    await newRental.save();

    res.status(201).json({
      success: true,
      message: "Rental listing created successfully",
      data: {
        rental: newRental,
        transactionHash: blockchainResponse.txHash
      }
    });
  } catch (error) {
    console.error("Error creating rental listing:", error);
    res.status(500).json({
      success: false,
      message: "Error creating rental listing",
      error: error.message
    });
  }
};

// Book a rental
exports.bookRental = async (req, res) => {
  try {
    const { rentalId } = req.body;
    const renterAddress = req.user.address; // Get from authenticated user

    if (!renterAddress) {
      return res.status(400).json({
        success: false,
        message: "User wallet address not found"
      });
    }

    const rental = await Rental.findOne({ tokenId: rentalId });
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found"
      });
    }

    // Check if rental is available
    if (rental.availableQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Rental is not available"
      });
    }

    // Calculate total amount (rent + deposit)
    const totalAmount = rental.rentAmount + rental.deposit;

    try {
      // Process payment from renter's wallet to owner's wallet
      const paymentResponse = await sendTransaction("process_payment", [
        renterAddress,
        rental.owner,
        totalAmount.toString()
      ]);

      // Create rental agreement on blockchain
      const agreementResponse = await sendTransaction("create_rental_agreement", [
        rentalId,
        renterAddress,
        rental.rentAmount.toString(),
        rental.deposit.toString()
      ]);

      // Update rental in database
      rental.availableQuantity -= 1;
      rental.rentals.push({
        renter: renterAddress,
        startDate: new Date(),
        paymentTxHash: paymentResponse.txHash,
        agreementTxHash: agreementResponse.txHash
      });
      await rental.save();

      res.status(200).json({
        success: true,
        message: "Rental booked successfully",
        data: {
          rental,
          paymentTxHash: paymentResponse.txHash,
          agreementTxHash: agreementResponse.txHash
        }
      });
    } catch (txnError) {
      console.error("Transaction error:", txnError);
      return res.status(500).json({
        success: false,
        message: "Transaction failed",
        error: txnError.message
      });
    }
  } catch (error) {
    console.error("Error booking rental:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error booking rental",
      error: error.message
    });
  }
};

// Complete a rental
exports.completeRental = async (req, res) => {
  try {
    const { rentalId, otp } = req.body;
    const renterAddress = req.user.address; // Get from authenticated user

    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found"
      });
    }

    // Find the active rental agreement
    const activeRental = rental.rentals.find(
      r => r.renter === renterAddress && !r.endDate
    );

    if (!activeRental) {
      return res.status(400).json({
        success: false,
        message: "No active rental found"
      });
    }

    // Verify OTP
    if (activeRental.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Calculate refund amount (deposit - penalties)
    const refundAmount = rental.deposit - (activeRental.penalties || 0);

    // Process refund from owner's wallet to renter's wallet
    const refundResponse = await sendTransaction("process_refund", [
      rental.owner,
      renterAddress,
      refundAmount.toString()
    ]);

    // Complete rental agreement on blockchain
    const completeResponse = await sendTransaction("complete_rental", [
      rentalId,
      renterAddress,
      rental.rentAmount.toString(),
      rental.deposit.toString()
    ]);

    // Update rental in database
    activeRental.endDate = new Date();
    activeRental.refundTxHash = refundResponse.txHash;
    activeRental.completeTxHash = completeResponse.txHash;
    rental.availableQuantity += 1;
    await rental.save();

    res.status(200).json({
      success: true,
      message: "Rental completed successfully",
      data: {
        rental,
        refundTxHash: refundResponse.txHash,
        completeTxHash: completeResponse.txHash
      }
    });
  } catch (error) {
    console.error("Error completing rental:", error);
    res.status(500).json({
      success: false,
      message: "Error completing rental",
      error: error.message
    });
  }
};

// Cancel a rental
exports.cancelRental = async (req, res) => {
  try {
    const { rentalId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const renterAddress = req.user.address;

    // Find rental
    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({ msg: "Rental not found" });
    }

    // Cancel rental on blockchain
    const txnHash = await sendTransaction("cancel_rental", [
      rentalId,
      renterAddress,
      rental.rentAmount,
      rental.deposit
    ]);

    // Update rental in database
    rental.status = "Canceled";
    rental.transactionHash = txnHash;
    await rental.save();

    res.status(200).json({ 
      msg: "Rental cancelled successfully", 
      rental,
      transactionHash: txnHash
    });
  } catch (error) {
    console.error("Cancellation Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Add penalty to a rental
exports.addPenalty = async (req, res) => {
  try {
    const { rentalId, penaltyAmount } = req.body;
    const ownerAddress = req.user.address; // Get from authenticated user

    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found"
      });
    }

    // Verify owner
    if (rental.owner !== ownerAddress) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add penalty"
      });
    }

    // Add penalty on blockchain
    const penaltyResponse = await sendTransaction("add_penalty", [
      rentalId,
      ownerAddress,
      penaltyAmount.toString()
    ]);

    // Update rental in database
    const activeRental = rental.rentals.find(r => !r.endDate);
    if (activeRental) {
      activeRental.penalties = (activeRental.penalties || 0) + penaltyAmount;
      activeRental.penaltyTxHash = penaltyResponse.txHash;
      await rental.save();
    }

    res.status(200).json({
      success: true,
      message: "Penalty added successfully",
      data: {
        rental,
        penaltyTxHash: penaltyResponse.txHash
      }
    });
  } catch (error) {
    console.error("Error adding penalty:", error);
    res.status(500).json({
      success: false,
      message: "Error adding penalty",
      error: error.message
    });
  }
};
