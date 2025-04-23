const crypto = require('crypto');

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

/**
 * Generate a 6-digit OTP
 * @returns {string} The generated OTP
 */
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

/**
 * Store OTP with expiration time
 * @param {string} email - User's email
 * @param {string} otp - Generated OTP
 * @param {number} expiryMinutes - OTP validity in minutes
 */
const storeOTP = (email, otp, expiryMinutes = 10) => {
    const expiryTime = Date.now() + (expiryMinutes * 60 * 1000);
    otpStore.set(email, {
        otp,
        expiryTime
    });
};

/**
 * Verify OTP
 * @param {string} email - User's email
 * @param {string} otp - OTP to verify
 * @returns {boolean} Whether OTP is valid
 */
const verifyOTP = (email, otp) => {
    const storedData = otpStore.get(email);
    
    if (!storedData) {
        return false;
    }

    if (Date.now() > storedData.expiryTime) {
        otpStore.delete(email);
        return false;
    }

    const isValid = storedData.otp === otp;
    if (isValid) {
        otpStore.delete(email);
    }

    return isValid;
};

/**
 * Clear expired OTPs
 */
const clearExpiredOTPs = () => {
    const now = Date.now();
    for (const [email, data] of otpStore.entries()) {
        if (now > data.expiryTime) {
            otpStore.delete(email);
        }
    }
};

// Run cleanup every 5 minutes
setInterval(clearExpiredOTPs, 5 * 60 * 1000);

module.exports = {
    generateOTP,
    storeOTP,
    verifyOTP
}; 