const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        default: null
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: Array,
        default: []
    },
    token: {
        type: String,
        default: ""
    },
    product: {
      type: Array,
      default: []
    },
    isOpenStore: {
      type: Boolean,
      default: false
    },
    phone: {
      type: Number,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
