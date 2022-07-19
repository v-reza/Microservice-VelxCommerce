const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    transactionId: {
        type: String
    },
    qty: {
        type: Number
    },
    amount: {
        type: String
    },
    transaction_status: {
        type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sales", SalesSchema);
