import { Router } from "express";
import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";
import authJwt from "../helpers/jwt.js";

const router = Router();

// Get cart items for the current user
router.get("/", authJwt(), async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.auth.userId })
      .populate({
        path: "items.product",
        select: "name price image"
      });

    if (!cart) {
      cart = new Cart({ user: req.auth.userId, items: [] });
      await cart.save();
    }

    res.send(cart.items);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add item to cart
router.post("/", authJwt(), async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.auth.userId });

    if (!cart) {
      // Create new cart if doesn't exist
      cart = new Cart({
        user: req.auth.userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      // Update existing cart
      const existingItem = cart.items.find(item => 
        item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    
    // Populate product details before sending response
    await cart.populate({
      path: "items.product",
      select: "name price image"
    });

    res.status(200).json({ 
      success: true, 
      items: cart.items
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update cart item quantity
router.put("/:productId", authJwt(), async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.auth.userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === req.params.productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }
    }

    await cart.save();
    await cart.populate({
      path: "items.product",
      select: "name price image"
    });

    res.status(200).json({ success: true, items: cart.items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove item from cart
router.delete("/:productId", authJwt(), async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.auth.userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => 
      item.product.toString() !== req.params.productId
    );

    await cart.save();
    
    // Populate product details before sending response
    await cart.populate({
      path: "items.product",
      select: "name price image"
    });
    
    res.status(200).json({ success: true, items: cart.items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear cart
router.delete("/", authJwt(), async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.auth.userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router; 