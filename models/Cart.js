const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        default: 1
    },
    status_transaction: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
