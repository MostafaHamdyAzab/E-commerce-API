const { check, validationResult } = require("express-validator");
const ApiError = require("../util/apiErrors");
const slugify = require("slugify");
const reviewModel = require("../Models/reviewsModel");
//validate MiddelWare
const reviewValidatorMiddelWare = (req, res, nxt) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ err: errors.array() });
    // return nxt(new ApiError("",process.env.MSG,400));
  }
  nxt();
};

const reviewTitleValidator = check("title").optional();

const reviewRatingValidator = check("rating")
  .notEmpty()
  .withMessage("Rating is Required")
  .isFloat({ min: 1, max: 5 })
  .withMessage("Rating Vvalue Must Be Between 1 and 5");

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
    //   .then((review) => {
    //     if (review) {
    //       return Promise.reject(new Error("U Already Create a Review Before"));
    //     }
    //   });
  });

// exports.getReviewValidator = [reviewIdVAlidator, reviewValidatorMiddelWare];
// exports.updateReviewValidator = [
//   reviewIdVAlidator,
//   reviewNameValidator,
//   reviewValidatorMiddelWare,
// ];
// exports.deleteReviewValidator = [reviewIdVAlidator, reviewValidatorMiddelWare];
exports.createReviewValidator = [
  reviewTitleValidator,
  reviewRatingValidator,
  reviewUserValidator,
  reviewProductValidator,
  reviewValidatorMiddelWare,
];
