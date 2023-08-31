const asyncHandler = require("express-async-handler");
const ApiError = require("../util/apiErrors");
const orderModel = require("../Models/orderModel");
const cartModel = require("../Models/cartModel");
const productModel = require("../Models/productModel");
const factory = require("./handlerFactory");

exports.createCashOrder = asyncHandler(async (req, res, nxt) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  const cart = await cartModel.findById(req.params.cartId);
  if (!cart) {
    return nxt(new ApiError(``, `No Cart For This Id`, 404));
  }
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totaOrderPrice = cartPrice + taxPrice + shippingPrice;
  const order = await orderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
  });
  if (order) {
    const bulkOpt = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    productModel.bulkWrite(bulkOpt, {});

    await cart.findByIdAndDelete(req.params.cartId);
  } //end if (order)
});
