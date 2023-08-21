const couponModel = require("../Models/couponModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../util/apiErrors");
const ApiFeatures = require("../util/apiFeatures");
const factory = require("./handlerFactory");

exports.getCoupons = factory.getAll(couponModel);

exports.getCoupon = factory.getOne(couponModel);

exports.createCoupon = factory.createOne(couponModel);

exports.updateCoupon = factory.updateOne(couponModel);

exports.deleteCoupon = factory.deleteOne(couponModel);
