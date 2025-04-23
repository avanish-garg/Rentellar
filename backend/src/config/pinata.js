const axios = require("axios");
const FormData = require("form-data"); // Import FormData
require("dotenv").config();

module.exports = {
  pinFileToIPFS: async (fileStream, options) => {
    try {
      const formData = new FormData();
      formData.append("file", fileStream); // Append the file stream
      formData.append("pinataMetadata", JSON.stringify(options.pinataMetadata)); // Add metadata
      formData.append("pinataOptions", JSON.stringify(options.pinataOptions)); // Add options

      console.log("FormData headers:", formData.getHeaders());
      console.log("FormData content length:", formData.getLengthSync());

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            ...formData.getHeaders(), // Include FormData headers
            pinata_api_key: process.env.PINATA_API_KEY, // Add Pinata API key
            pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY, // Add Pinata API secret
          },
          maxContentLength: Infinity, // Allow large files
          maxBodyLength: Infinity, // Allow large files
        }
      );

      console.log("Pinata response:", response.data);

      if (!response.data || !response.data.IpfsHash) {
        throw new Error("Failed to upload file to Pinata.");
      }

      return response.data;
    } catch (error) {
      console.error("Pinata upload error:", error.response?.data || error.message);
      throw error;
    }
  },
};