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

exports.forgetPassword = asyncHandler(async (req, res, nxt) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return nxt(new ApiError("", "Email Not Found", 404));
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); //10 min expirarion
  const hashedRestCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  console.log(resetCode);
  user.passwordResetCode = hashedRestCode;
  user.passwordResetExpire = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();
  const message = `Hi ${user.userName}\n We Receive a Request To Reset Your Password./n${resetCode}\n\n 
                   Enter This Code To Complete The Reset  `;

  await sendEmail({
    to: "allahakbar00100@gmail.com",
    subject: "Your Password Reset Code is (is valid for 10 min only)",
    message: message,
  }).then(() => {
    console.log("sent");
  });

  // user.passwordResetExpire = undefined;
  // user.passwordResetVerified = undefined;
  // user.passwordResetVerified = undefined;
  // await user.save();
  // return nxt(new ApiError("Error in Sending Email", "", 500));

  res.status(200).send({ message: "Reset Done" });
});

exports.verifyPassRestCode = asyncHandler(async (req, res, nxt) => {
  //get user based on resetcode
  const hashedRestCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await userModel.findOne({
    passwordResetCode: hashedRestCode,
    passwordResetExpire: { $gt: Date.now() },
  });
  if (!user) {
    return nxt(new ApiError("", "Rest code not valid or Expired", 401));
  }
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json(user);
});
