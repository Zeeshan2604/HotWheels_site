import { Router } from "express";
import { Product } from "../models/product.js";
import { Category } from "../models/collection.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const searchQuery = req.query.q;
    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Create a case-insensitive regex for the search
    const searchRegex = new RegExp(searchQuery, 'i');

    // Search in products
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ]
    }).populate('category').limit(5);

    // Search in categories
    const categories = await Category.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex }
      ]
    }).limit(3);

    res.json({
      products,
      categories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 