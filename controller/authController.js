const jwt = require("jsonwebtoken");
const ApiError = require("../util/apiErrors");
const userModel = require("../Models/userModel");

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

exports.protect = (req, res) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("azab")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // console.log("ssss",token)
  if (!token) {
    throw new ApiError("", "First Login", 400);
  }
  const decoded = jwt.verify(token, process.env.jwtSecrtKey); //verfiy token
  console.log(decoded);
};

exports.wellcome = (req, res, nxt) => {
  res.json("sssssssssss");
};
