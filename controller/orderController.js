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
    totalOrderPrice: totaOrderPrice,
  });

  if (order) {
    const bulkOpt = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    productModel.bulkWrite(bulkOpt, {});
  } //end if (order)
  await cartModel.findByIdAndRemove({ _id: req.params.cartId });
  res.status(202).json({ order: order });
});

exports.getFilterObjForLoggedUser = asyncHandler((req, res, nxt) => {
  if (req.user.role == "user") {
    req.filterObj = { user: req.user._id };
  }
  nxt();
});

exports.getOrders = factory.getAll(orderModel);

exports.getOrder = asyncHandler(async (req, res, nxt) => {
  if (req.user.role === "admin") {
    res.send({ data: await orderModel.find({ _id: req.params.id }) });
  } else {
    const order = await orderModel.find({ _id: req.params.id });
    order[0].user.equals(req.user._id)
      ? res.send({ data: order })
      : nxt(new ApiError("", "U Not have permission To Access This Data", 401));
  }
});
