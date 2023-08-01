const sharp = require("sharp");
const { uuid } = require("uuidv4");
const bcrypt = require("bcryptjs");

const asyncHandler = require("express-async-handler");
const userModel = require("../Models/userModel");
const crypto = require("crypto");
const ApiError = require("../util/apiErrors");
const factory = require("./handlerFactory");
const { uploadSingleFile } = require("../middelwares/uploadFiles");

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

exports.hi = (req, res, nxt) => {
  console.log("hi");
};
