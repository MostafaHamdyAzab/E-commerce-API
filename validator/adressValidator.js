const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const ApiError = require("../util/apiErrors");
const userModel = require("../Models/userModel");
//validate MiddelWare
const adressValidatorMiddelWare = (req, res, nxt) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ err: errors.array() });
  }
  nxt();
};

const checkAlias = check("alias")
  .notEmpty()
  .withMessage("alias Is required")
  .custom(async (val) => {
    console.log(val);
    const alias = await userModel.findOne({ "addresses.alias": val });
    console.log(alias);
    if (alias) {
      return Promise.reject(new ApiError("", "This Alias Used Before", 400));
    }
  });

exports.addAddress = [checkAlias, adressValidatorMiddelWare];
