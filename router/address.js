const router = require("express").Router();
const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");
const verifyBearerToken = require("../config/verifyBearerToken");
const Sales = require("../models/Sales");
const UserAddress = require("../models/UserAddress");

router.get("/", verifyBearerToken, async (req, res) => {
  try {
    const useraddress = await UserAddress.find({
      userId: req.user.userId,
    });
    res.status(200).json(useraddress);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", verifyBearerToken, async (req, res) => {
  try {
    const useraddess = await UserAddress.create({
      userId: req.user.userId,
      address: req.body.address,
      city: req.body.city,
      province: req.body.province,
      zipcode: req.body.zipcode,
      country: req.body.country,
    });
    res.status(200).json(useraddess);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", verifyBearerToken, async (req, res) => {
  try {
    const userAddress = await UserAddress.findById(req.params.id);
    res.status(200).json(userAddress);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id/updateAddress", verifyBearerToken, async (req, res) => {
  try {
    const userAddress = await UserAddress.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
      userId: req.user.userId,
    });
    await userAddress.updateOne(req.body);
    res.status(200).json("Success update address");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", verifyBearerToken, async (req, res) => {
  try {
    await UserAddress.updateMany(
      {
        userId: req.user.userId,
        isPrimary: true,
      },
      {
        $set: {
          isPrimary: false,
        },
      }
    );
    const userAddressIsPrimary = await UserAddress.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
      userId: req.user.userId,
    });
    await userAddressIsPrimary.updateOne({
      $set: { isPrimary: true },
    });
    res.status(200).json("Success update user address");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", verifyBearerToken, async (req, res) => {
  try {
    const userAddress = await UserAddress.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
      userId: req.user.userId,
    });
    await userAddress.deleteOne();
    res.status(200).json("Success delete user address");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
