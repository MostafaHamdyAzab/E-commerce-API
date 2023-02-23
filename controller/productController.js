const productModel=require("../Models/productModel");
const slugify=require('slugify');
const asyncHandler=require('express-async-handler');
const apiError=require('../util/apiErrors');
const ApiError = require("../util/apiErrors");
const ApiFeatures = require("../util/apiFeatures");
const { json } = require("body-parser");
const {createOne,deleteOne,getOne,getAll}=require('./handlerFactory');

exports.getProducts=getAll(productModel,'Products');

//get specific cat
exports.getProduct=getOne(productModel);

exports.createProduct=createOne(productModel);

exports.updateProduct=((req,res,nxt)=>{
   const id=req.params.id;
   if(req.body.title){
   req.body.slug=slugify(req.body.title);
   }
   productModel.findOneAndUpdate(
         {_id:id},
         req.body,
         {new:true})
      .then((newProduct)=>{
            res.status(200).json({data:newProduct});
      })
      .catch((err)=>{
         // process.env.MSG="Not found Category compat to this id";
         return nxt(new ApiError("","Not found Category compat to this id",404));
      })
      });

exports.deleteProduct=deleteOne(productModel);
