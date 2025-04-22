const express = require("express");
const sendEmail = require("../config/emailConfig");

const router = express.Router();

// POST route to send email
router.post("/send-email", async (req, res) => {
    const { username, email, message } = req.body;

    if (!username || !email || !message) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        await sendEmail(username, email, message);
        res.status(200).json({ success: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email." });
    }
});

module.exports = router;
