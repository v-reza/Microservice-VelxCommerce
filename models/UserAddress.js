const mongoose = require("mongoose");

const UserAddress = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "Indonesia",
    },
    province: {
      type: String,
      default: "",
    },
    zipcode: {
      type: Number,
    },
    userId: {
      type: String,
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserAddress", UserAddress);
