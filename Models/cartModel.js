const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
        color: String,
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
