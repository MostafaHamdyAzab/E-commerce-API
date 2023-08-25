const ApiError = require("../util/apiErrors");
const cartModel = require("../Models/cartModel");
const productModel = require("../Models/productModel");
const asyncHandler = require("express-async-handler");

exports.addProductToCart = asyncHandler(async (req, res, nxt) => {
  const { productId, color } = req.body.product;
  const product = productModel.findById(productId);
  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    cart = await cart.create({
      user: req.user._id,
      cart: [{ product: productId, color, price: product.price }],
    });
  } else {
    console.log("ther is  Cart");
  }
});
