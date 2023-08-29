const express = require("express");
const cartController = require("../controller/cartController");
const authController = require("../controller/authController");
const router = express.Router();
router.use(authController.protect, authController.allowedTo("user"));

router.post("/", cartController.addProductToCart);
router.get("/", cartController.getLoggedUserCart);
router.delete("/:itemId", cartController.removeSpecificCartItem);

module.exports = router;
