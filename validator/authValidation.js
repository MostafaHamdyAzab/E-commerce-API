const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const ApiError = require("../util/apiErrors");
const userModel = require("../Models/userModel");

//validate MiddelWare
const loginValidatorMiddelWare = (req, res, nxt) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ err: errors.array() });
  }
  nxt();
};

const passwordValidator = check("password")
  .notEmpty()
  .withMessage("Password Is Required");

const emaildValidator = //check email in login
  check("email")
    .notEmpty() //if check() fullData send Message
    .withMessage("email Is required")
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (email, { req }) => {
      const user = await userModel.findOne({ email: email });
      //check password
      if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        throw new ApiError("", "Incorrect Credintials", 401);
      }
    });

exports.loginValidator = [
  passwordValidator,
  emaildValidator,
  loginValidatorMiddelWare,
];
