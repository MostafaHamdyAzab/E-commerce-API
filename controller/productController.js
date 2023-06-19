const productModel=require("../Models/productModel");
const slugify=require('slugify');
const asyncHandler=require('express-async-handler');
const apiError=require('../util/apiErrors');
const ApiError = require("../util/apiErrors");
const ApiFeatures = require("../util/apiFeatures");
const { json } = require("body-parser");
const {createOne,deleteOne,getOne,getAll}=require('./handlerFactory');
const multer=require('multer');
const { uuid } = require('uuidv4');
const sharp=require('sharp');
const {uploadMultiFiles}=require('../middelwares/uploadFiles');

exports.resizeProductImages=asyncHandler( async (req,res,nxt)=>{
      // console.log(req.files);
      if(req.files.imageCover){
            const imageCoverfileName=`product-${uuid()}-${Date.now()}-cover.jpeg`;
            await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1300)
            .toFormat('jpeg')
            .jpeg({quality:90})
            .toFile(`upload/products/${imageCoverfileName}`);
            req.body.imageCover=imageCoverfileName;
           
      };
      if(req.files.images){
            req.body.images=[];
       await Promise.all( //to await this loop
            req.files.images.map(async(img,index)=>{
                  const imageProductName=`product-${uuid()}-${Date.now()}-${index+1}.jpeg`;
                  await sharp(img.buffer)
                  .resize(600, 600)
                  .toFormat('jpeg')
                  .jpeg({quality:90})
                  .toFile(`upload/products/${imageProductName}`);
                  req.body.images.push(imageProductName);
            })


        );
      }
      nxt();
  
  });
  
exports.uploadProductImages=uploadMultiFiles([{name:'imageCover',maxCount:1},
                                              {name:'images',maxCount:5}
                                                ]);



//getAllProducts
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
