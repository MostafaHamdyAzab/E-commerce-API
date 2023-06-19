const brandModel=require("../Models/brandModel");//الماركة
const slugify=require('slugify');
const asyncHandler=require('express-async-handler');
const apiError=require('../util/apiErrors');
const ApiError = require("../util/apiErrors");
const ApiFeatures = require("../util/apiFeatures");
const factory=require('./handlerFactory');
const {uploadSingleFile}=require('../middelwares/uploadFiles');
const sharp=require("sharp");
const { uuid } = require('uuidv4');

exports.getBrands=factory.getAll(brandModel);


//image Processing
exports.resizeBrandImage=asyncHandler( async (req,res,nxt)=>{
    const fileName=`brand-${uuid()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`upload/brands/${fileName}`);
    req.body.image=fileName;
    nxt();

});

//upload single image
exports.uploadBrandImage= uploadSingleFile('image');
// upload.single('image');


//get specific Brand
exports.getBrand=factory.getOne(brandModel);


exports.createBrand=factory.createOne(brandModel);

exports.updateBrand=factory.updateOne(brandModel);

exports.deleteBrand=factory.deleteOne(brandModel);

