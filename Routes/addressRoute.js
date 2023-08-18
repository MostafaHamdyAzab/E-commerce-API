const express = require("express");
const addressController = require("../controller/addressController");
const authController = require("../controller/authController");
const router = express.Router();
const addressValidator = require("../validator/adressValidator");

router.use(authController.protect, authController.allowedTo("user"));

router
  .route("/")
  .post(addressValidator.addAddress, addressController.addAddress);

router.delete("/:addressId", addressController.removeAddress);

router.get("/", addressController.getAddressLoggedUserList);

module.exports = router;
