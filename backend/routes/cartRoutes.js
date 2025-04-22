const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");
const cartController = require("../controllers/cartController");

router.post("/add", authenticateUser, cartController.addToCart);
router.get("/", authenticateUser, cartController.getCartItems);
router.delete("/remove/:rentalId", authenticateUser, cartController.removeFromCart);
router.delete("/clear", authenticateUser, cartController.clearCart);

module.exports = router;
