const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  renterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  adminWallet: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionHash: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Completed" },
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
