const express=require('express');
const userController=require("../controller/userController");
const {param, validationResult}=require('express-validator');
const router=express.Router();
const userValidator=require('../validator/userValidation');
// const subCatRoute=require("./subCatRoute");
router.route('/')
    .get(userController.getUsers )
    .post(userController.uploaduserImage ,
          userController.resizeUserImage,
          userValidator.createuserValidator,
          userController.createUser);

    //nested route
// router.use('/:category/subcats',subCatRoute);

router.route('/:id')
      .get(userValidator.getuserValidator,
           userController.getUser );
          
router.put('/:id',userController.uploaduserImage ,
                  userController.resizeUserImage,
                  userValidator.updateuserValidator,
                  userController.updateUser);

//update userPassword using current Passsowrd
router.put('/updateUserPassword/:id',userValidator.updateuserPasswordValidator ,
                                     userController.updateUserPassword);                  


router.delete('/:id',userValidator.deleteuserValidator,
                     userController.deleteUser);
module.exports = router;

