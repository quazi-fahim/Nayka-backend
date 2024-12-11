// Controller/Cart.js
const express = require("express");
const Cart = require("../Models/cart");
const Product = require("../Models/product.schema"); // Assuming you have a Product model
const router = express.Router();

// Add item to cart
router.post("/add", async (req, res) => {
    try {
      const { productId, quantity } = req.body;
  
      if (!productId || !quantity) {
        return res.status(400).json({ success: false, message: "Product ID and quantity are required." });
      }
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found." });
      }
  
      // Calculate price based on product's price and quantity
      const price = product.price * quantity;
  
      // Check if item already exists in the cart
      const existingItem = await Cart.findOne({ productId });
      if (existingItem) {
        // Update quantity and price if the item already exists
        existingItem.quantity += quantity;
        existingItem.price = product.price * existingItem.quantity; // Update price based on new quantity
        await existingItem.save();
        return res.status(200).json({ success: true, cart: existingItem });
      }
  
      // Create a new cart item
      const newCartItem = new Cart({ productId, quantity, price });
      await newCartItem.save();
      res.status(201).json({ success: true, cart: newCartItem });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // Get all cart items and total price
  router.get("/", async (req, res) => {
    try {
      const cartItems = await Cart.find().populate("productId");
      
      // Calculate the total price of all items in the cart
      const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
      
      res.status(200).json({
        success: true,
        cart: cartItems,
        totalPrice,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // Remove item from cart
  router.delete("/remove/:id", async (req, res) => {
    try {
      const cartItemId = req.params.id;
  
      const cartItem = await Cart.findById(cartItemId);
      if (!cartItem) {
        return res.status(404).json({ success: false, message: "Cart item not found." });
      }
  
      await cartItem.remove();
      res.status(200).json({ success: true, message: "Item removed from cart." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

module.exports = router;
