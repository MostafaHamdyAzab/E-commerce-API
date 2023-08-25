const express = require("express");
const cartController = require("../controller/cartController");
const authController = require("../controller/authController");
const router = express.Router();
router.use(authController.protect, authController.allowedTo("user"));

router.post("/", cartController.addProductToCart);

module.exports = router;
