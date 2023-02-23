const express=require('express');
const subCatController=require("../controller/subCatController");
const {param, validationResult}=require('express-validator');
const {applySlugify}=require('../controller/handlerFactory');

//to access parameter in another routes(catId)
const router=express.Router({mergeParams:true});
const subCatValidator=require('../validator/subCatValidation');

// router.post('/',subCatValidator.createsubCatValidator,subCatController.createSubCat);

router.route('/')
      .post(subCatValidator.createsubCatValidator,subCatController.createSubCat)
      .get(subCatController.getSubCats);

router.get('/:id',subCatValidator.getsubCatValidator,subCatController.getsubCat);

router.put('/:id',subCatValidator.updatesubCatValidator,applySlugify,subCatController.updateSubCat);

router.delete('/:id',subCatValidator.deletesubCatValidator,subCatController.deleteSubCat)



module.exports = router;