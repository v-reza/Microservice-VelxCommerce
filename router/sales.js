const router = require("express").Router();
const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");
const verifyBearerToken = require("../config/verifyBearerToken");
const Sales = require("../models/Sales");

router.get("/", verifyBearerToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    let cartIds = [];
    const cart = await Cart.aggregate([
      {
        $project: {
          productId: {
            $toObjectId: "$productId",
          },
          status_transaction: {
            $toBool: "$status_transaction",
          },
          cartId: {
            $toObjectId: "$_id",
          },
          qty: {
            $toInt: "$qty",
          },
        },
      },
      {
        $match: {
          status_transaction: true,
          productId: {
            $in: Array.from(user.product),
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
    ]);
    cart.map((c) => {
      cartIds.push({
        cartId: c._id,
        qty: c.qty,
        price: parseInt(c.product[0].product_price) * parseInt(c.qty),
      });
    });

    cartIds.forEach(async (item) => {
      const transaction = await Transaction.findOne({
        cart_id: item.cartId.toString(),
      });
      const checkSales = await Sales.findOne({
        transactionId: transaction._id,
      });
      if (!checkSales) {
        await Sales.create({
          userId: user._id,
          transactionId: transaction._id,
          qty: item.qty,
          amount: item.price,
          transaction_status: transaction.transaction_status
        });
      }
    });

    const sales = await Sales.find({
      userId: user._id,
    });

    return res.status(200).json(sales);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
