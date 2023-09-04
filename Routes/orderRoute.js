const express = require("express");
const orderController = require("../controller/orderController");
const authController = require("../controller/authController");
const router = express.Router();

router.use(authController.protect, authController.allowedTo("user", "admin"));

router.post(
  "/:cartId",
  authController.allowedTo("user"),
  orderController.createCashOrder
);

router.get(
  "",
  //   authController.allowedTo("admin", "user"),
  orderController.getFilterObjForLoggedUser,
  orderController.getOrders
);
router.get("/:id", orderController.getOrder);

module.exports = router;
