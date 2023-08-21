const express = require("express");
const couponController = require("../controller/couponController");
const authController = require("../controller/authController");
const router = express.Router();
router.use(authController.protect, authController.allowedTo("admin"));
router
  .route("/")
  .get(couponController.getBrands)
  .post(
    couponController.uploadBrandImage,
    couponController.resizeBrandImage,
    couponController.createBrandValidator,
    couponController.createBrand
  );

router
  .route("/:id")
  .get(couponController.getBrandValidator, brandController.getBrand);

router.delete(
  "/:id",
  couponController.deleteBrandValidator,
  brandController.deleteBrand
);
module.exports = router;
