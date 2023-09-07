const express = require("express");
const orderController = require("../controller/orderController");
const authController = require("../controller/authController");
const router = express.Router();

router.use(authController.protect);

router.get(
  "/checkOut-session/:cartId",
  authController.allowedTo("user"),
  orderController.checkOutSession
);

router.post(
  "/:cartId",
  authController.allowedTo("user"),
  orderController.createCashOrder
);

router.get(
  "",
  authController.allowedTo("admin", "user"),
  orderController.getFilterObjForLoggedUser,
  orderController.getOrders
);
router.get("/:id", orderController.getOrder);

router.put(
  "/:id/pay",
  authController.allowedTo("admin"),
  orderController.updateOrderToPaid
);
router.put("/:id/deliver", orderController.updateOrderToDelivered);

module.exports = router;
