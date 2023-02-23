const express=require('express');
const ProductController=require("../controller/productController");
const {param, validationResult}=require('express-validator');
const router=express.Router();
const productValidator = require('../validator/productValidation');
// const subCatRoute=require("./subCatRoute");
router.route('/')
    .get(ProductController.getProducts)
    .post(productValidator.createProductValidator,ProductController.createProduct);

    //nested route
// router.use('/:category/subcats',subCatRoute);

router.route('/:id')
      .get(productValidator.getProductValidator,ProductController.getProduct);
          
router.put('/:id',productValidator.updateProductValidator,ProductController.updateProduct);
router.delete('/:id',productValidator.deleteProductValidator,ProductController.deleteProduct);
module.exports = router;

