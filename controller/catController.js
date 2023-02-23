const categoryModel=require("../Models/categoryModel");
const slugify=require('slugify');
const asyncHandler=require('express-async-handler');
const apiError=require('../util/apiErrors');
const ApiError = require("../util/apiErrors");
const factory=require('./handlerFactory');


exports.getCats=factory.getAll(categoryModel);

//get specific cat
exports.getCat=factory.getOne(categoryModel);

exports.createCat=factory.createOne(categoryModel);

exports.updateCat=factory.updateOne(categoryModel);

exports.deleteCat=factory.deleteOne(categoryModel);
