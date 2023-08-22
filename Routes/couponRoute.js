const express = require("express");
const couponController = require("../controller/couponController");
const authController = require("../controller/authController");
const router = express.Router();
router.use(authController.protect, authController.allowedTo("user"));
router
  .route("/")
  .get(couponController.getCoupons)
  .post(couponController.createCoupon);

router.route("/:id").get(couponController.getCoupon);
router.route("/:id").put(couponController.updateCoupon);

router.delete("/:id", couponController.deleteCoupon);
module.exports = router;
