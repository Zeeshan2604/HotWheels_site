import { Category } from "../models/collection.js";
import { Router } from "express";
const router = Router();
import multer, { diskStorage } from "multer";
import { Types } from "mongoose";

//get all categories
router.get(`/`, async (req, res) => {
  const category = await Category.find();

  if (!category) {
    res.status(500).json({ success: false });
  }
  res.send(category);
});

//get single category
router.get("/:id", async (req, res) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid ID");
  }

  const category = await Category.findById(req.params.id);

  if (!category) {
    res
      .status(500)
      .json({ message: "The collection with the given Id was not found" });
  }
  res.status(200).send(category);
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

// create a category
router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send("No image in the request");

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
      image: `${basePath}${fileName}`,
    });
    category = await category.save();
    res.status(201).send(category);
  } catch (error) {
    return res.status(404).send("The collection cannot be created!");
  }
});

//update the category
router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send("No image in the request");

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        image: `${basePath}${fileName}`,
      },
      { new: true }
    );
    res.send(category);
  } catch (error) {
    return res.status(404).send("The collection cannot be updated!");
  }
});

//delete a category
router.delete("/:id", (req, res) => {
  Category.findByIdAndDelete(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "the collection is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "collection was not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

export default router;
