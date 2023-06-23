const userModel=require("../Models/userModel");
const slugify=require('slugify');
const asyncHandler=require('express-async-handler');
const apiError=require('../util/apiErrors');
const ApiError = require("../util/apiErrors");
const ApiFeatures = require("../util/apiFeatures");
const factory=require('./handlerFactory');
const {uploadSingleFile}=require('../middelwares/uploadFiles');
const sharp=require("sharp");
const { uuid } = require('uuidv4');
const bcrypt=require('bcryptjs');

//image Processing
exports.resizeUserImage=asyncHandler( async (req,res,nxt)=>{
    const fileName=`users-${uuid()}-${Date.now()}.jpeg`;
    if(req.file){
    await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`upload/users/${fileName}`);
    req.body.profileImage=fileName;
    }
    nxt();

});

//upload single image
exports.uploaduserImage= uploadSingleFile('profileImage');
// upload.single('image');


//get specific Brand
exports.getUser=factory.getOne(userModel);

exports.getUsers=factory.getAll(userModel);

exports.createUser=factory.createOne(userModel);

exports.updateUser=factory.updateOne(userModel);

exports.deleteUser=factory.deleteOne(userModel);

exports.updateUserPassword=(async(req,res,nxt)=>{
    const id=req.params.id;
   await userModel.findOneAndUpdate(
          {_id:id},
          {password:await bcrypt.hash(req.body.password,12)},
          {new:true  })
       .then((newDocument)=>{
             res.status(200).json({data:newDocument});
            })
            .catch((err)=>{
                // process.env.MSG="Not found Category compat to this id";
                return nxt(new ApiError("","Not found Category compat to this id",404));
            });
});

