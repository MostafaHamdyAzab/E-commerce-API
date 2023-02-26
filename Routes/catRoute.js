const express=require('express');
const catController=require("../controller/catController");
const {param, validationResult}=require('express-validator');
const router=express.Router();
const catVAlidator = require('../validator/catValidation');
const subCatRoute=require("./subCatRoute");
const {applySlugify}=require("../controller/handlerFactory");
router.route('/')
    .get(catController.getCats)
    .post(catVAlidator.createCatValidator,catController.createCat);

    //nested route       
router.use('/:category/subcats',subCatRoute);

router.route('/:id')
      .get(catVAlidator.getCatValidator,catController.getCat);
          
router.put('/:id',catVAlidator.updateCatValidator,applySlugify,catController.updateCat);
router.delete('/:id',catVAlidator.deleteCatValidator,catController.deleteCat);
module.exports = router;

