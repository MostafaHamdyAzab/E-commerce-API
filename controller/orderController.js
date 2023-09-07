const asyncHandler = require("express-async-handler");
const ApiError = require("../util/apiErrors");
const orderModel = require("../Models/orderModel");
const cartModel = require("../Models/cartModel");
const productModel = require("../Models/productModel");
const factory = require("./handlerFactory");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

exports.updateOrderToPaid = asyncHandler(async (req, res, nxt) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return nxt(new ApiError(``, `No Order For This Id`, 404));
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();
  res.send({ status: "Success", data: updatedOrder });
});

exports.updateOrderToDelivered = asyncHandler(async (req, res, nxt) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return nxt(new ApiError(``, `No Order For This Id`, 404));
  }
  order.isDelivered = true;
  order.DeliveredAt = Date.now();
  const updatedOrder = await order.save();
  res.send({ status: "Success", data: updatedOrder });
});

exports.checkOutSession = asyncHandler(async (req, res, nxt) => {
  const cart = await cartModel.findById(req.params.cartId);
  if (!cart) {
    return nxt(new ApiError(``, `No Cart For This Id`, 404));
  }
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totaOrderPrice = cartPrice;
  console.log(`${req.domain}://${req.get("host")}/orders`);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        //name: req.user.userName,
        // amount: totaOrderPrice * 100,
        quantity: 1,

        price_data: {
          currency: "egp",
          unit_amount: 2000,
          product_data: {
            name: "Book",
            description: "Comfortable cotton t-shirt",
            images: ["https://example.com/t-shirt.png"],
          },
        },
      },
    ], //end lineItems
    mode: "payment",
    success_url: `http://${req.get("host")}/orders`,
    cancel_url: `http://${req.get("host")}/cart`,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });
  res.status(200).json({ status: "success", session });
});
