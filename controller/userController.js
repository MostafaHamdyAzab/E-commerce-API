const sharp = require("sharp");
const { uuid } = require("uuidv4");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");
const userModel = require("../Models/userModel");
const crypto = require("crypto");
const ApiError = require("../util/apiErrors");
const factory = require("./handlerFactory");
const { uploadSingleFile } = require("../middelwares/uploadFiles");

const generateToken = (payload) =>
  jwt.sign(
    { userId: payload }, //payload
    process.env.jwtSecrtKey, //secrt key
    { expiresIn: process.env.jwtExpire } //option
  );

//image Processing
exports.resizeUserImage = asyncHandler(async (req, res, nxt) => {
  const fileName = `users-${uuid()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`upload/users/${fileName}`);
    req.body.profileImage = fileName;
  }
  nxt();
});

//upload single image
exports.uploaduserImage = uploadSingleFile("profileImage");
// upload.single('image');

//get specific Brand
exports.getUser = factory.getOne(userModel);

exports.getUsers = factory.getAll(userModel);

exports.createUser = factory.createOne(userModel);

exports.updateUser = factory.updateOne(userModel);

exports.deleteUser = factory.deleteOne(userModel);

exports.getLoggedUserData = asyncHandler(async (req, res, nxt) => {
  console.log(req.user);
  req.params.id = req.user._id;
  nxt();
});

//update password while logging in and still login
exports.updateLoggedUserPassword = asyncHandler(async (req, res, nxt) => {
  const user = await userModel
    .findOneAndUpdate(
      { _id: req.user._id },
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(), //pass change at
      },
      { new: true }
    )
    .then((newDocument) => {
      const token = generateToken(req.user._id);
      res.status(400).json({ data: newDocument, token: token });
    })

    .catch(() =>
      // process.env.MSG="Not found Category compat to this id";
      nxt(new ApiError("", "Not found user compat to this id", 404))
    );
}); //end updateLoggedUserPassword

exports.updateLoggedUserData = asyncHandler(async (req, res, nxt) => {
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});

exports.updateUserPassword = async (req, res, nxt) => {
  const { id } = req.params;

  await userModel
    .findOneAndUpdate(
      { _id: id },
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(), //pass change at
      },
      { new: true }
    )
    .then((newDocument) => {
      res.status(200).json({ data: newDocument });
    })
    .catch(() =>
      // process.env.MSG="Not found Category compat to this id";
      nxt(new ApiError("", "Not found Category compat to this id", 404))
    );
};

exports.deActivateUser=asyncHandler(async(req,res,nxt)=>{
  await userModel.findByIdAndUpdate(req.user._id,{active:false});
  res.status(204).send({status:true});
});

exports.activateUser=asyncHandler(async(req,res,nxt)=>{

  const user=await userModel.findOneAndUpdate({email:req.body.email},{active:true},{new:true});
  if(user){
    res.status(200).send({msg:'Your Account Activated Correctly'},{data:user});
  }else{
    return nxt(
      new ApiError("", "Not found Account Match To This Email", 401)
    )
  }
});
 