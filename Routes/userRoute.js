const express = require("express");

const router = express.Router();
const userController = require("../controller/userController");
const userValidator = require("../validator/userValidation");
const authContrller = require("../controller/authController");

router.get(
  "/getMe",
  authContrller.protect,
  userController.getLoggedUserData,
  userController.getUser
);
router
  .route("/")
  .get(userController.getUsers)
  .post(
    userController.uploaduserImage,
    userController.resizeUserImage,
    userValidator.createuserValidator,
    userController.createUser
  );

// router.use('/:category/subcats',subCatRoute);

router
  .route("/:id")
  .get(userValidator.getuserValidator, userController.getUser);

router.put(
  "/:id",
  userController.uploaduserImage,
  userController.resizeUserImage,
  userValidator.updateuserValidator,
  userController.updateUser
);

//update userPassword using current Passsowrd
router.put(
  "/updateUserPassword/:id",
  userValidator.updateuserPasswordValidator,
  userController.updateUserPassword
);

router.delete(
  "/:id",
  authContrller.protect,
  authContrller.allowedTo("admin"),
  userValidator.deleteuserValidator,
  userController.deleteUser
);

module.exports = router;
