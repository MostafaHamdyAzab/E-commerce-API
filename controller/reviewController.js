const brandModel = require("../Models/brandModel"); //الماركة
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const apiError = require("../util/apiErrors");
const ApiError = require("../util/apiErrors");
const ApiFeatures = require("../util/apiFeatures");
const factory = require("./handlerFactory");
const reviewModel = require("../Models/reviewsModel");

exports.getReviews = factory.getAll(reviewModel);
//get specific Brand
exports.getReview = factory.getOne(reviewModel);

exports.createReview = factory.createOne(reviewModel);

exports.updateReview = factory.updateOne(reviewModel);

exports.deleteReview = factory.deleteOne(reviewModel);
