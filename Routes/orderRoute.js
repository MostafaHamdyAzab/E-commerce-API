const express = require("express");
const orderController = require("../controller/orderController");
const authController = require("../controller/authController");
const router = express.Router();
router.use(authController.protect, authController.allowedTo("user"));

router.post("/:cartId", orderController.createCashOrder);

module.exports = router;
