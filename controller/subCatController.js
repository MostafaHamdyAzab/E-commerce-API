const subCategoryModel=require("../Models/subCategoryModel");
const slugify=require('slugify');
const asyncHandler=require('express-async-handler');
const { body } = require("express-validator");
const factory=require('./handlerFactory');


exports.createSubCat=factory.createOne(subCategoryModel);

 exports.getsubCat=factory.getOne(subCategoryModel);
 
 exports.getSubCats=factory.getAll(subCategoryModel);
 

 exports.updateSubCat=factory.updateOne(subCategoryModel);


exports.deleteSubCat=factory.deleteOne(subCategoryModel);

//get all Subcats Depends on category
