const express = require("express");
const reviewController = require("../controller/reviewController");
const { param, validationResult } = require("express-validator");
const router = express.Router();
const authController = require("../controller/authController");
const { applySlugify } = require("../controller/handlerFactory");

router
  .route("/")
  .get(reviewController.getReviews) //for any user
  .post(
    authController.protect,
    authController.allowedTo("user"),
    reviewController.createReview
  );

//nested route
// router.use('/:category/subcats',subCatRoute);

router.route("/:id").get(reviewController.getReview); //for any user

router.put(
  "/:id",
  authController.protect,
  authController.allowedTo("user"),
  reviewController.updateReview
);

router.delete(
  "/:id",
  authController.protect,
  authController.allowedTo("user"),
  reviewController.deleteReview
);
module.exports = router;
