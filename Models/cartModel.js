const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.objectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
        color: String,
        totalCartPrice: Number,
        totalPriceAfterDiscount: Number,
        user: {
          type: mongoose.Schema.objectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
