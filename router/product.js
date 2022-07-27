const router = require("express").Router();
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const User = require("../models/User");
const verifyBearerToken = require("../config/verifyBearerToken");
const mongoose = require("mongoose");

/**
 * Create Product
 */
router.post("/", verifyBearerToken, async (req, res) => {
  try {
    const newProduct = await new Product(req.body);
    const product = await newProduct.save();

    const user = await User.findById(req.user.userId);
    await user.updateOne({ $push: { product: product._id } });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

/**
 * Get All Product by userid
 */
router.get("/by/userId", verifyBearerToken, async (req, res) => {
  try {
    const user = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
    ]);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

/**
 * Get all product
 */
router.get("/", async (req, res) => {
  try {
    const product = await Product.find();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

/**
 * Get bestseller product
 */
router.get("/all/bestseller", async (req, res) => {
  try {
    const product = await Product.find().sort({ product_buying: -1 }).limit(5);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

/**
 * Increment Product Views
 */
router.put("/views/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      $inc: { product_views: 1 },
    });
    res.status(200).json("Product views has increased");
  } catch (error) {
    res.status(500).json(error);
  }
});

/**
 * Update Product
 */
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json("Product not found");

    await product.updateOne({ $set: req.body });
    res.status(200).json("Product has been updated");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/category", async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/list/category", async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:productId", verifyBearerToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    await user.updateOne({
      $pull: { product: mongoose.Types.ObjectId(req.params.productId) },
    });
    const product = await Product.findById(req.params.productId);
    await product.deleteOne();
    res.status(200).json("success delete product");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
