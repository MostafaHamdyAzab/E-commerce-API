const ApiError = require("../util/apiErrors");
const cartModel = require("../Models/cartModel");
const productModel = require("../Models/productModel");
const couponModel = require("../Models/couponModel");
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
  cart.totalCartPrice = calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({ msg: "Product added Successfully", data: cart });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, nxt) => {
  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return nxt(new ApiError("", "U Not Have Any Cards", 404));
  }
  res.status(200).json({ NOfCarts: cart.cartItems.length, carts: cart });
});

exports.removeSpecificCartItem = asyncHandler(async (req, res, nxt) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );
  cart.totalCartPrice = calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({ NOfCarts: cart.cartItems.length, carts: cart });
});

exports.clearCart = asyncHandler(async (req, res, nxt) => {
  await cartModel.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

exports.updateItemQuantity = asyncHandler(async (req, res, nxt) => {
  const { quantity } = req.body;
  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return nxt(new ApiError(``, `U Not Have Any Carts`, 404));
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() == req.params.cartItem
  );
  if (itemIndex > -1) {
    const item = cart.cartItems[itemIndex];
    item.quantity = quantity;
    cart.cartItems[itemIndex] = item;
  } else {
    return nxt(
      new ApiError(
        ``,
        `this cart item not exist for this id ${req.params.cartItem}`,
        404
      )
    );
  } //end else
  cart.totalCartPrice = calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({ NOfCarts: cart.cartItems.length, carts: cart });
});

exports.applyCoupon = asyncHandler(async (req, res, nxt) => {
  const coupon = await couponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return nxt(new ApiError(``, `Coupon Is Expired Or Invalid`, 404));
  }
  const cart = await cartModel.findOne({ user: req.user._id });
  const totalPriceAfterDiscount = (
    cart.totalCartPrice -
    (cart.totalCartPrice * coupon.discount) / 100
  ).toFixed(2);
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();
  res.status(200).json({ NOfCarts: cart.cartItems.length, carts: cart });
});

const calcTotalPrice = (cart) => {
  let totaltPrice = 0;
  cart.cartItems.forEach((item) => {
    totaltPrice += item.price * item.quantity;
  });
  cart.totalPriceAfterDiscount = undefined;
  return totaltPrice;
};
