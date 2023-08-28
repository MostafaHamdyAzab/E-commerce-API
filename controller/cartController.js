const ApiError = require("../util/apiErrors");
const cartModel = require("../Models/cartModel");
const productModel = require("../Models/productModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

exports.addProductToCart = asyncHandler(async (req, res, nxt) => {
  const { productId, color } = req.body;
  const product = await productModel.findById(productId);
  let cart = await cartModel.findOne({ user: req.user._id });
  // console.log(cart);
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
    //if product in cart updaye quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product == productId && item.color === color
    );
    console.log(productIndex);
    if (productIndex > -1) {
      cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } //product not in cart
    else {
      cart.cartItems.push({
        product: mongoose.Types.ObjectId(productId),
        color: color,
        price: product.price,
      });
    }
  }
  await cart.save();
});
