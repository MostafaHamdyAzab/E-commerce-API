const ApiError = require("../util/apiErrors");
const cartModel = require("../Models/cartModel");
const productModel = require("../Models/productModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

exports.addProductToCart = asyncHandler(async (req, res, nxt) => {
  const { productId, color } = req.body;
  const product = await productModel.findById(productId);
  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    cart = await cartModel.create({
      user: req.user._id,
      cartItems: [
        {
          product: mongoose.Types.ObjectId(productId),
          color: color,
          price: product.price,
        },
      ],
    });
  } else {
    console.log("ther is  Cart");
  }
});
