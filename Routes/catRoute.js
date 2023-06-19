const express=require('express');
const catController=require("../controller/catController");
const {param, validationResult}=require('express-validator');
const router=express.Router();
const catVAlidator = require('../validator/catValidation');
const subCatRoute=require("./subCatRoute");
const {applySlugify}=require("../controller/handlerFactory");
const multer=require('multer');
const upload=multer({dest:'upload/cats'});

router.route('/')
    .get(catController.getCats)
    .post(catController.uploadCatImage
          ,catController.resizeImage
          ,catVAlidator.createCatValidator
          ,catController.createCat);

    //nested route       
router.use('/:category/subcats',subCatRoute);

router.route('/:id')
      .get(catVAlidator.getCatValidator,catController.getCat);
          
router.put('/:id',catController.uploadCatImage
                 ,catController.resizeImage
                 ,catVAlidator.updateCatValidator
                 ,applySlugify,catController.updateCat);
router.delete('/:id',catVAlidator.deleteCatValidator,catController.deleteCat);
module.exports = router;

