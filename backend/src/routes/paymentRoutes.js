const express = require("express");
const router = express.Router();
const { processPayment } = require("../controllers/paymentController");

// POST - Process Payment
router.post("/pay", processPayment);

module.exports = router;
