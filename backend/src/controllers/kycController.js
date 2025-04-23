// const KYCDocument = require("../models/KYCDocument");
// const multer = require("multer");
// const fs = require("fs");
// const pinata = require("../config/pinata"); // Import Pinata configuration

// // Configure Multer (Stores temporarily before uploading to Pinata)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage }).single("document");

// // KYC Document Upload Function
// exports.uploadKYC = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

//     const { documentType } = req.body;
//     const userId = req.user.userId; // Set by `authenticateUser`

//     // Verify file exists
//     const filePath = req.file.path;
//     if (!fs.existsSync(filePath)) {
//       return res.status(500).json({ msg: "File missing after upload" });
//     }

//     // Upload to Pinata
//     // // Upload to Pinata
// const readableStreamForFile = fs.createReadStream(filePath);
// const formData = new FormData();
// formData.append("file", readableStreamForFile);
// formData.append("pinataMetadata", JSON.stringify({ name: req.file.filename }));
// formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

// const formHeaders = {
//   ...formData.getHeaders(),
//   "Content-Length": formData.getLengthSync(), // 🔥 Explicitly set Content-Length
//   Authorization: `Bearer ${process.env.PINATA_JWT}`,
// };

// console.log("Uploading to Pinata...");

// const result = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
//   headers: formHeaders,
// });

//     // Delete local file after successful upload
//     fs.unlinkSync(filePath);

//     // Store in MongoDB
//     const newKYC = new KYCDocument({
//       user: userId,
//       documentType,
//       documentURL: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
//     });

//     await newKYC.save();
//     res.status(201).json({ msg: "KYC document uploaded successfully", document: newKYC });
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({ msg: "Server error", error: error.message });
//   }
// };
const axios = require("axios");
const FormData = require("form-data");
const multer = require("multer");
const fs = require("fs");
const KYCDocument = require("../models/KYCDocument");

// Configure Multer (Temporary file storage before Pinata upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).single("document");

// KYC Document Upload Function
exports.uploadKYC = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const { documentType } = req.body;
    // const userId = req.user.userId; // From authentication middleware
    const userId = req.user?._id; // Use `_id` instead of `userId`
if (!userId) return res.status(400).json({ msg: "User ID is missing" });

console.log("Extracted userId:", userId); // Debug log


    // Verify file exists
    const filePath = req.file.path;
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ msg: "File missing after upload" });
    }

    // Prepare FormData for Pinata
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    formData.append("pinataMetadata", JSON.stringify({ name: req.file.filename }));
    formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

    // Get headers dynamically
    const formHeaders = await new Promise((resolve, reject) => {
      formData.getLength((err, length) => {
        if (err) reject(err);
        resolve({
          ...formData.getHeaders(),
          "Content-Length": length, // ✅ Fix for "Cannot calculate proper length" error
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        });
      });
    });

    console.log("Uploading to Pinata...");

    // Upload to Pinata
    const result = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      { headers: formHeaders }
    );

    console.log("Pinata response:", result.data);

    if (!result.data || !result.data.IpfsHash) {
      throw new Error("Failed to upload file to Pinata.");
    }

    // Delete local file after successful upload
    fs.unlinkSync(filePath);

    // Store document in MongoDB
    const newKYC = new KYCDocument({
      user: userId,
      documentType,
      ipfsHash: result.data.IpfsHash,
      documentURL: `https://gateway.pinata.cloud/ipfs/${result.data.IpfsHash}`,
      
    });

    await newKYC.save();
    res.status(201).json({ msg: "KYC document uploaded successfully", document: newKYC });

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.verifyKYC = async (req, res) => {
  try {
    const { status } = req.body;
    const adminId = req.user.id;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    const kycDoc = await KYCDocument.findById(req.params.id);
    if (!kycDoc) return res.status(404).json({ msg: "KYC document not found" });

    // Update status
    kycDoc.status = status;
    kycDoc.reviewedBy = adminId;
    await kycDoc.save();

    res.status(200).json({ msg: `KYC ${status} successfully`, document: kycDoc });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

