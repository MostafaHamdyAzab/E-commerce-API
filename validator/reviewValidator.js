const { check, validationResult } = require("express-validator");
const ApiError = require("../util/apiErrors");
const slugify = require("slugify");
const reviewModel = require("../Models/reviewsModel");
const { Promise } = require("mongoose");
//validate MiddelWare
const reviewValidatorMiddelWare = (req, res, nxt) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ err: errors.array() });
    // return nxt(new ApiError("",process.env.MSG,400));
  }
  nxt();
};

const reviewTitleValidator = check("title")
  .notEmpty()
  .withMessage("Rating is Required");

const reviewRatingValidator = check("rating")
  .notEmpty()
  .withMessage("Rating is Required")
  .isFloat({ min: 1, max: 5 })
  .withMessage("Rating Vvalue Must Be Between 1 and 5");

const reviewIdValidator = check("id")
  .isMongoId()
  .withMessage("Invalid Id Validator");

//chcek review ownership for user
const reviewUserIdValidator = check("id")
  .isMongoId()
  .withMessage("Invalid Id Validator")
  .custom(async (val, { req }) => {
    const review = await reviewModel.findById(val);
    if (!review) {
      Promise.reject(new Error(`not found review for this ${id}`));
      return new ApiError("", "not found review for this", 401);
    }
    if (!review.user._id.equals(req.user._id)) {
      return Promise.reject(
        new Error(`U are not allowed to update this review`)
      );
    }
  });

const reviewUserRoleValidator = check("id")
  .isMongoId()
  .withMessage("Invalid Id Validator")
  .custom(async (val, { req }) => {
    if (req.user.role == "user") {
      const review = await reviewModel.findById(val);
      if (!review) {
        Promise.reject(new Error(`not found review for this ${id}`));
        return new ApiError("", "not found review for this", 401);
      }
      if (!review.user.equals(req.user._id)) {
        return Promise.reject(
          new Error(`U are not allowed to update this review`)
        );
      }
    } //end if(req.user.role=='user'){
  });

const reviewUserValidator = check("user")
  .isMongoId()
  .withMessage("Invalid UserID Format");

const reviewProductValidator = check("product")
  .isMongoId()
  .withMessage("Invalid Product ID Format")
  .custom(async (val, { req }) => {
    console.log(req.body.product);
    const x = await reviewModel.findOne({
      user: req.user._id,
      product: req.body.product,
    });
    if (x) {
      return Promise.reject(
        new Error("U Already Create a Review For This Product Before")
      );
    }
  });

exports.getReviewValidator = [reviewIdValidator, reviewValidatorMiddelWare];

exports.updateReviewValidator = [
  reviewIdValidator,
  reviewUserIdValidator,
  reviewTitleValidator,
  reviewRatingValidator,
  reviewValidatorMiddelWare,
];
exports.deleteReviewValidator = [
  reviewIdValidator,
  reviewUserRoleValidator,
  reviewValidatorMiddelWare,
];

exports.createReviewValidator = [
  reviewTitleValidator,
  reviewRatingValidator,
  reviewUserValidator,
  reviewProductValidator,
  reviewValidatorMiddelWare,
];
