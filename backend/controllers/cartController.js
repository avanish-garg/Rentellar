const Cart = require("../models/cart");

// ✅ Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { rentalId } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // ✅ Check if item is already in cart
    if (cart.items.some((item) => item.rental.toString() === rentalId)) {
      return res.status(400).json({ msg: "Item already in cart" });
    }

    cart.items.push({ rental: rentalId });
    await cart.save();

    res.status(200).json({ msg: "Item added to cart", cart });
  } catch (error) {
    console.error("Error Adding to Cart:", error.message);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// ✅ Get Cart Items
exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.rental");

    if (!cart) return res.status(200).json({ msg: "Cart is empty", items: [] });

    res.status(200).json({ msg: "Cart items fetched", items: cart.items });
  } catch (error) {
    console.error("Error Fetching Cart:", error.message);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// ✅ Remove Item from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { rentalId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    cart.items = cart.items.filter((item) => item.rental.toString() !== rentalId);
    await cart.save();

    res.status(200).json({ msg: "Item removed from cart", cart });
  } catch (error) {
    console.error("Error Removing Item:", error.message);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// ✅ Clear Cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    res.status(200).json({ msg: "Cart cleared" });
  } catch (error) {
    console.error("Error Clearing Cart:", error.message);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};
