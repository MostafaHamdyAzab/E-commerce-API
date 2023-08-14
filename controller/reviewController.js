const brandModel = require("../Models/brandModel"); //الماركة
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const apiError = require("../util/apiErrors");
const ApiError = require("../util/apiErrors");
const ApiFeatures = require("../util/apiFeatures");
const factory = require("./handlerFactory");
const reviewModel = require("../Models/reviewsModel");
var mongoose = require("mongoose");
//nested route
exports.createFilterObj = (req, res, nxt) => {
  filterObj = {};
  if (req.params.productId) {
    filterObj = { product: req.params.productId };
  }
  req.filterObj = filterObj;
  nxt();
};

exports.getReviews = factory.getAll(reviewModel);

exports.getReview = factory.getOne(reviewModel);

exports.setProductIdAndUserIdToBody = (req, res, nxt) => {
  console.log("ddddd", req.params.productId);
  if (!req.body.product)
    req.body.product = mongoose.Types.ObjectId(req.params.productId);
  if (!req.body.user) req.body.user = req.user._id;
  nxt();
};
exports.createReview = factory.createOne(reviewModel);

exports.updateReview = factory.updateOne(reviewModel);

exports.deleteReview = factory.deleteOne(reviewModel);
