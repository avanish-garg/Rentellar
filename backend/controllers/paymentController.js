const jwt = require("jsonwebtoken");
const Payment = require("../models/Payment");
const User = require("../models/User");
const { sendAptosTransaction } = require("../utils/aptosHelper");

exports.processPayment = async (req, res) => {
  try {
    // Extract JWT token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Unauthorized: No token provided" });

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const renterId = decoded.userId; // Assuming userId is stored in JWT
    const renterWallet = decoded.address; // Assuming walletAddress is in JWT

    const { amount } = req.body;
    const adminWallet = process.env.ADMIN_WALLET_ADDRESS;

    if (!renterId || !amount) return res.status(400).json({ msg: "Missing required fields" });

    // Fetch renter details
    const renter = await User.findById(renterId);
    if (!renter) return res.status(404).json({ msg: "User not found" });

    if (!renterWallet) return res.status(400).json({ msg: "Renter wallet not connected" });

    // Send payment transaction from renter to admin
    const txnHash = await sendAptosTransaction(renterWallet, adminWallet, amount);

    // Store payment in MongoDB
    const payment = new Payment({
      renterId,
      adminWallet,
      amount,
      status: "Completed",
      transactionHash: txnHash,
    });
    await payment.save();

    res.status(200).json({ msg: "Payment successful", payment });
  } catch (error) {
    res.status(500).json({ msg: "Payment failed", error: error.message });
  }
};
