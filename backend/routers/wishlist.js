import { Router } from "express";
import { WishlistItem } from "../models/wishlist.js";
import { Product } from "../models/product.js";
import authJwt from "../helpers/jwt.js";

const router = Router();

// Add to wishlist
router.post("/", authJwt(), async (req, res) => {
  const { productId } = req.body;

  try {
    const existingItem = await WishlistItem.findOne({ user: req.auth.userId, product: productId });
    if (existingItem) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    const wishlistItem = new WishlistItem({
      user: req.auth.userId,
      product: productId
    });

    await wishlistItem.save();
    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's wishlist
router.get("/", authJwt(), async (req, res) => {
  try {
    const wishlistItems = await WishlistItem.find({ user: req.auth.userId }).populate("product");
    res.json(wishlistItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from wishlist
router.delete("/:id", authJwt(), async (req, res) => {
  try {
    const wishlistItem = await WishlistItem.findByIdAndDelete(req.params.id);
    if (!wishlistItem) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }
    res.json({ message: "Wishlist item removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 