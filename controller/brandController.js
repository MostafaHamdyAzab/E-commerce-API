const brandModel=require("../Models/brandModel");//الماركة
const slugify=require('slugify');
const asyncHandler=require('express-async-handler');
const apiError=require('../util/apiErrors');
const ApiError = require("../util/apiErrors");
const ApiFeatures = require("../util/apiFeatures");
const factory=require('./handlerFactory');


exports.getBrands=factory.getAll(brandModel);
// (asyncHandler(async (req,res,nex)=>{
//    const NofBrands=await brandModel.countDocuments();
//    const apiFeatures=new ApiFeatures(brandModel.find(),req.query).paginate(NofBrands).search().filter().limitFields().sort();
//    const brands=await apiFeatures.mongooseQuery;
//    res.status(200).json({results:brands.length,paginationResult:apiFeatures.paginationResult,data:brands});
// }));

//get specific cat
exports.getBrand=factory.getOne(brandModel);


exports.createBrand=factory.createOne(brandModel);

exports.updateBrand=factory.updateOne(brandModel);

exports.deleteBrand=factory.deleteOne(brandModel);

