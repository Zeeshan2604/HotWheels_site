import { Category } from "../models/collection.js";
import { Product } from "../models/product.js";
import { Router } from "express";
const router = Router();
import { isValidObjectId } from "mongoose";
import multer, { diskStorage } from "multer";

// Get featured products (e.g., /api/v1/products/get/featured/4)
router.get('/get/featured/:count', async (req, res) => {
  const count = req.params.count ? parseInt(req.params.count) : 0;
  try {
    const products = await Product.find({ isFeatured: true }).limit(count);
    res.send(products);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enhanced get all products with support for limit and sort query params
router.get(`/`, async (req, res) => {
  let filter = {};
  let sort = {};
  
  // Handle category filter
  if (req.query.category) {
    filter = { category: req.query.category };
  }
  
  // Handle sorting
  if (req.query.sort) {
    const sortField = req.query.sort.startsWith('-') ? req.query.sort.substring(1) : req.query.sort;
    const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
    sort = { [sortField]: sortOrder };
  }

  // Handle limit
  const limit = parseInt(req.query.limit) || 0;
  
  try {
    const productList = await Product.find(filter)
      .populate("category")
      .sort(sort)
      .limit(limit);
    res.send(productList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//get a single product with try-catch block
router.get(`/:id`, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category');
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.send(product);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//////////////////////////////////////////////////////
//************* Images upload **********************//

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}=${Date.now()}.${extension}`);
  },
});
const uploadOptions = multer({ storage: storage });

//create a product linked with a category or collection
router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");

    const file = req.file;
    if (!file) return res.status(400).send("No image in the request");

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${basePath}${fileName}`,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    product = await product.save();
    res.status(201).send(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//update a product details
router.put("/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id))
    return res.status(400).send("Invalid Product Id");

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );
  if (!product) return res.status(404).send("The product cannot be updated!");

  res.send(product);
});

//delete a product
router.delete("/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "the product is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product was not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

// product count
router.get(`/get/count`, async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    res.send({ count: productCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//featured product
router.get(`/get/featured/:count`, async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true })
      .limit(+count)
      .populate('category');
    
    if (!products) {
      return res.status(404).json({ success: false, message: 'No featured products found' });
    }
    res.send(products);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Product Id");
    }

    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );
    if (!product) return res.status(404).send("The images cannot be updated!");

    res.send(product);
  }
);

export default router;
