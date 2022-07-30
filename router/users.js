const router = require("express").Router();
const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const verifyBearerToken = require("../config/verifyBearerToken");

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/", verifyBearerToken, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: mongoose.Types.ObjectId(req.user.userId),
    });
    await user.updateOne(req.body);
    const userUpdate = await User.findById(req.user.userId);
    return res.status(200).json(userUpdate);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/addToCart/:productId", async (req, res) => {
  const { userId } = req.body;
  try {
    const product = await Product.findById(req.params.productId);
    await product.updateOne({ $inc: { product_buying: 1 } });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json("User not found");

    if (!user.cart.includes(product._id)) {
      await user.updateOne({ $push: { cart: product._id } });
    }
    const cart = await Cart.findOne({
      userId: userId,
      productId: product._id,
      status_transaction: false,
    });
    if (!cart) {
      await Cart.create({
        userId: userId,
        productId: product._id,
        status_transaction: false,
      });
    } else {
      await cart.updateOne({ $inc: { qty: 1 } });
    }
    res.status(200).json("Success add to cart");
  } catch (error) {
    res.status(500).json(error);
  }
});

/**
 * Get Cart
 */
router.get("/cart/:userId", async (req, res) => {
  try {
    const cart = await Cart.aggregate([
      {
        $project: {
          userId: {
            $toString: "$userId",
          },
          qty: {
            $toInt: "$qty",
          },
          productId: {
            $toObjectId: "$productId",
          },
          status_transaction: {
            $toBool: "$status_transaction",
          },
        },
      },
      {
        $match: {
          userId: req.params.userId,
          status_transaction: false,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "cart",
        },
      },
    ]);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/cart/:cartId/:key", async (req, res) => {
  const { userId } = req.body;
  try {
    const currentCart = await Cart.findById(req.params.cartId);
    const user = await User.findById(userId);

    if (currentCart.userId === userId) {
      if (req.params.key === "-") {
        const product = await Product.findById(currentCart.productId);
        await product.updateOne({ $inc: { product_buying: -1 } });

        await currentCart.updateOne({ $inc: { qty: -1 } });
        const afterUpdate = await Cart.findById(req.params.cartId);
        if (afterUpdate.qty === 0) {
          const productId = afterUpdate.productId;
          if (user.cart.includes(currentCart.productId)) {
            await user.updateOne({
              $pull: { cart: mongoose.Types.ObjectId(afterUpdate.productId) },
            });
          }
          await currentCart.deleteOne({ _id: afterUpdate._id });
          return res.status(200).json({
            pull: true,
            productId: productId,
          });
        }
        return res.status(200).json("success decrement qty");
      }
      const product = await Product.findById(currentCart.productId);
      await product.updateOne({ $inc: { product_buying: 1 } });
      await currentCart.updateOne({ $inc: { qty: 1 } });
      return res.status(200).json("Success increment qty");
    }
    res.status(404).json("user not found");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/cart/:cartId", async (req, res) => {
  const { userId } = req.body;
  try {
    const currentCart = await Cart.findOne({
      _id: req.params.cartId,
      status_transaction: false,
    });
    const user = await User.findById(userId);
    if (currentCart.userId === userId) {
      await user.updateOne({
        $pull: { cart: mongoose.Types.ObjectId(currentCart.productId) },
      });
      const product = await Product.findById(currentCart.productId);
      await product.updateOne({ $inc: { product_buying: -currentCart.qty } });
      const productId = currentCart.productId;
      await currentCart.deleteOne();
      return res.status(200).json({
        pull: true,
        productId: productId,
      });
    }
    res.status(200).json("user not found");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/cart/:cartId/change/quantity", async (req, res) => {
  const { userId, qty } = req.body;
  try {
    const currentCart = await Cart.findById(req.params.cartId);
    const user = await User.findById(userId);
    if (currentCart.userId === userId) {
      await currentCart.updateOne({ $set: { qty: qty } });
      return res.status(200).json("success update quantity");
    }
    res.status(404).json("user not found");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
