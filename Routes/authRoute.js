const express=require('express');
const router=express.Router();
const userValidator=require('../validator/userValidation');
const authValidator=require('../validator/authValidation');
const authController=require("../controller/authController");
const userController=require("../controller/userController");


router.route('/signUp')
      .post(userController.uploaduserImage ,
            userController.resizeUserImage,
            userValidator.createuserValidator,
            authController.signUp);

router.route('/login')
      .post(authValidator.loginValidator,authController.login)


module.exports = router;

