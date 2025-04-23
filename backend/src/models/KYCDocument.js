// const mongoose = require("mongoose");

// const KYCDocumentSchema = new mongoose.Schema(
//   {
//     user: { 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: "User", 
//       required: true 
//     },
//     documentType: { 
//       type: String, 
//       required: true, 
//       enum: ["Passport", "Driving License", "National ID", "Other"] 
//     },
//     documentURL: { 
//       type: String, 
//       required: true 
//     },
//     status: { 
//       type: String, 
//       enum: ["Pending", "Approved", "Rejected"], 
//       default: "Pending" 
//     }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("KYCDocument", KYCDocumentSchema);
const mongoose = require("mongoose");

const KYCDocumentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  documentType: { type: String, required: true },
  ipfsHash: { type: String, required: true, unique: true }, // Only storing hash
  documentURL: { type: String, required: true }, // Optional, but useful for retrieval
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, // KYC Status
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("KYCDocument", KYCDocumentSchema);
