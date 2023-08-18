const express = require("express");
const wishListController = require("../controller/wishListController");
const authController = require("../controller/authController");
const router = express.Router();

router.use(authController.protect, authController.allowedTo("user"));
router.route("/").post(wishListController.addProductToWishList);

router.delete("/:productId", wishListController.removeProductFromWishList);

router.get("/", wishListController.getWishLoggedUserList);

module.exports = router;
