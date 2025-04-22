const nodemailer = require("nodemailer");
require("dotenv").config();

// Create Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  // Your Gmail
        pass: process.env.EMAIL_PASS   // Your App Password
    }
});

// Send Email Function
const sendEmail = async (username, userEmail, message) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Always your Gmail
        to: process.env.ADMIN_EMAIL,   // Email of the admin
        subject: "New Contact Form Submission",
        text: `User: ${username}\nEmail: ${userEmail}\n\nMessage:\n${message}`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
    
const sendOTPEmail = async (email, otp) => {
    await transporter.sendMail({
      from: `"Rental Service" <${process.env.EMAIL_USER}>`, // Dynamic sender email
      to: email,
      subject: "Your Rental OTP",
      text: `Your OTP for rental confirmation is: ${otp}`,
    });
  };
  
  module.exports = sendOTPEmail;