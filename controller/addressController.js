const asyncHandler = require("express-async-handler");
const userModel = require("../Models/userModel");
const ApiError = require("../util/apiErrors");
const factory = require("./handlerFactory");

exports.addAddress = asyncHandler(async (req, res, nxt) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body }, //add product once
    },
    { new: true }
  );
  res.status(200).json({ msg: "Success To Add address", data: user.addresses });
});

exports.removeAddress = asyncHandler(async (req, res, nxt) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } }, //add product once
    },
    { new: true }
  );
  res
    .status(200)
    .json({ msg: "Success To Remove address", data: user.addressest });
});

exports.getAddressLoggedUserList = asyncHandler(async (req, res, nxt) => {
  const user = await userModel.findById(req.user._id);
  res.status(200).json({
    NOAddresses: user.addresses.length,
    data: user.addresses,
  });
});
