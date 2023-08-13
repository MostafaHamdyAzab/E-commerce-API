const express = require("express");
const reviewController = require("../controller/reviewController");
const router = express.Router();
const authController = require("../controller/authController");
const reviewValidator = require("../validator/reviewValidator");

router
  .route("/")
  .get(reviewController.getReviews) //for any user
  .post(
    authController.protect,
    authController.allowedTo("user", "admin"),
    reviewValidator.createReviewValidator,
    reviewController.createReview
  );

//nested route
// router.use('/:category/subcats',subCatRoute);

router.route("/:id").get(reviewController.getReview); //for any user

router.put(
  "/:id",
  authController.protect,
  authController.allowedTo("user"),
  reviewValidator.updateReviewValidator,
  reviewController.updateReview
);

router.delete(
  "/:id",
  authController.protect,
  authController.allowedTo("user", "admin"),
  reviewValidator.deleteReviewValidator,
  reviewController.deleteReview
);
module.exports = router;
