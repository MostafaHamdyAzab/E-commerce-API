const express=require('express');
const brandController=require("../controller/brandController");
const {param, validationResult}=require('express-validator');
const router=express.Router();
const brandValidator = require('../validator/brandValidation');
const {applySlugify}=require('../controller/handlerFactory');
// const subCatRoute=require("./subCatRoute");
router.route('/')
    .get(brandController.getBrands)
    .post(brandValidator.createBrandValidator,brandController.createBrand);

    //nested route
// router.use('/:category/subcats',subCatRoute);

router.route('/:id')
      .get(brandValidator.getBrandValidator,brandController.getBrand);
          
router.put('/:id',brandValidator.updateBrandValidator,applySlugify,brandController.updateBrand);
router.delete('/:id',brandValidator.deleteBrandValidator,brandController.deleteBrand);
module.exports = router;

