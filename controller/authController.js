const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const ApiError = require("../util/apiErrors");
const userModel = require("../Models/userModel");
const sendEmail = require("../util/sendEmail");

const generateToken = (payload) =>
  jwt.sign(
    { userId: payload }, //payload
    process.env.jwtSecrtKey, //secrt key
    { expiresIn: process.env.jwtExpire } //option
  );

exports.signUp = async (req, res) => {
  const user = await userModel.create({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    profileImage: req.body.profileImage,
    role: req.body.role,
  });
  //generate jwt token
  const token = jwt.sign(
    { userId: user._id }, //payload
    process.env.jwtSecrtKey, //secrt key
    { expiresIn: process.env.jwtExpire } //option
  );
  res.status(201).json({ data: user, token: token });
}; //end exports.signUp

exports.login = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  const token = generateToken(user._id);
  res.json({ user: user, token: token });
};

//make sure that user is logged in
exports.protect = async (req, res, nxt) => {
  let token;
  if (
    req.headers.authorization
    // && req.headers.authorization.startsWith("azab")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new ApiError("", "First Login", 400);
  }
  const decoded = jwt.verify(token, process.env.jwtSecrtKey); //verfiy token

  //check if user is still exists ,may admin delete him
  const currentUser = await userModel.findById(decoded.userId);
  if (!currentUser) {
    return nxt(
      new ApiError("", "The USer Belong To This Header Not Exist", 401)
    );
  }
  if (currentUser.active === "false" || currentUser.active === false) {
    return nxt(
      new ApiError("", "Your Account Not Active First Active It", 401)
    );
  }
  //check if user change password and session not ended
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimesStmp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedTimesStmp > decoded.iat) {
      //password changed after Token created
      return nxt(
        new ApiError(
          "",
          "The User Recntly changed password Please Login Again",
          401
        )
      );
    }
  }
  req.user = currentUser;
  nxt();
}; //end exports.protect

//user permissions
exports.allowedTo = (
  ...roles //rest parameter syntax
) =>
  asyncHandler(async (req, res, nxt) => {
    if (!roles.includes(req.user.role)) {
      return nxt(
        new ApiError("", "U not have a permission To access this route", 403)
      );
    }
    nxt();
  });

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

  res.status(200).send({ message: "Mail Sent" });
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

exports.resetPassword = asyncHandler(async (req, res, nxt) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return nxt(new ApiError("", "Not Found User Related To This Eamil", 404));
  }
  if (!user.passwordResetVerified) {
    return nxt(new ApiError("", "Rest Code Not Verfiy", 404));
  }
  user.password = req.body.password;
  user.passwordResetCode = undefined;
  user.passwordResetExpire = undefined;
  user.passwordResetVerified = false;
  user.passwordChangedAt = Date.now();

  await user.save();
  const token = generateToken(user._id); //Make user login
  res.status(200).json(token);
});

//   const user = await userModel.findOne({ email: req.body.email });
//   if (!user) {
//     return nxt(new ApiError("", "Email Not Found", 404));
//   }
//   const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); //10 min expirarion
//   const hashedRestCode = crypto
//     .createHash("sha256")
//     .update(resetCode)
//     .digest("hex");
//   console.log(resetCode);
//   user.passwordResetCode = hashedRestCode;
//   user.passwordResetExpire = Date.now() + 10 * 60 * 1000;
//   user.passwordResetVerified = false;
//   await user.save();
//   const message = `Hi ${user.userName}\n We Receive a Request To Reset Your Password./n${resetCode}\n\n
//                    Enter This Code To Complete The Reset  `;

//   await sendEmail({
//     to: "allahakbar00100@gmail.com",
//     subject: "Your Password Reset Code is (is valid for 10 min only)",
//     message: message,
//   }).then(() => {
//     console.log("sent");
//   });

//   // user.passwordResetExpire = undefined;
//   // user.passwordResetVerified = undefined;
//   // user.passwordResetVerified = undefined;
//   // await user.save();
//   // return nxt(new ApiError("Error in Sending Email", "", 500));

//   res.status(200).send({ message: "Reset Done" });
// });

// exports.verifyPassRestCode = asyncHandler(async (req, res, nxt) => {
//   //get user based on resetcode
//   const hashedRestCode = crypto
//     .createHash("sha256")
//     .update(req.body.resetCode)
//     .digest("hex");
//   const user = await userModel.findOne({
//     passwordResetCode: hashedRestCode,
//     passwordResetExpire: { $gt: Date.now() },
//   });
//   if (!user) {
//     return nxt(new ApiError("", "Rest code not valid or Expired", 401));
//   }
//   user.passwordResetVerified = true;
//   await user.save();
//   res.status(200).json(user);
// });
