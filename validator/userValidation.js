const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const ApiError = require("../util/apiErrors");
const userModel = require("../Models/userModel");
//validate MiddelWare
const userValidatorMiddelWare = (req, res, nxt) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ err: errors.array() });
  }
  nxt();
};

const userIdVAlidator = check("id")
  .isMongoId()
  .withMessage("Invalid Cat ID Format");

const userNameValidator = check("userName")
  .notEmpty()
  .withMessage("user Name Is required")
  .isLength({ min: 3 })
  .withMessage("Too Short user Name");

const EmailValidator = check("email")
  .notEmpty()
  .withMessage("email Is required")
  .isEmail()
  .withMessage("Invalid Email")
  // check('email' , "Invalid email").isEmail()
  .custom(async (val) => {
    const user = await userModel.findOne({ email: val });
    if (user) {
      return Promise.reject(new ApiError("", "Sorry Email In Use", 400));
    }
  });

const passwordValidator = check("password")
  .notEmpty()
  .withMessage("Password Is Required")
  .isLength({ min: 3 })
  .withMessage("Too Short Password")
  .custom((password, { req }) => {
    if (password !== req.body.confirmPassword) {
      throw new ApiError("", "password confirmation in correct", 400);
    }
    return true;
  });

const confirmPassword = check("confirmPassword")
  .notEmpty()
  .withMessage("consfirm password is required");

const profileImageValidator = check("profileImage").optional();

const phoneValidator = check("phone")
  .optional()
  .isMobilePhone("ar-EG")
  .withMessage("Enter Egypt Valid Phone Number ");

const roleValidaor = check("role").optional();

const checkUserUpdate = //user cant reset password from here
  check("password").isEmpty().withMessage("Cant Update Password Here."); //if check() fullData send Message

const updateUserPasswordValidator = check("currentPassword")
  .notEmpty()
  .withMessage("Enter Your Current Password") //if check() not fullData send Message
  .custom(async (password, { req }) => {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      throw new ApiError("", "User Id Not found", 400);
    }
    const isTheUserPassword = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!isTheUserPassword) {
      throw new ApiError("", "Incorrect Current Password", 400);
    }
  });

exports.getuserValidator = [userIdVAlidator, userValidatorMiddelWare];
exports.updateuserValidator = [
  userIdVAlidator,
  checkUserUpdate,
  userNameValidator,
  phoneValidator,
  roleValidaor,
  profileImageValidator,
  userValidatorMiddelWare,
];

exports.updateLoggedUserValidator = [
  EmailValidator,
  phoneValidator,
  roleValidaor,
  phoneValidator,
  userValidatorMiddelWare,
];

exports.updateuserPasswordValidator = [
  userIdVAlidator,
  updateUserPasswordValidator,
  passwordValidator,
  userValidatorMiddelWare,
];

exports.deleteuserValidator = [userIdVAlidator, userValidatorMiddelWare];

exports.createuserValidator = [
  userNameValidator,
  EmailValidator,
  confirmPassword,
  passwordValidator,
  phoneValidator,
  userValidatorMiddelWare,
];
