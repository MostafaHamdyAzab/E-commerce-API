const asyncHandler = require("express-async-handler");
const userModel = require("../Models/userModel");

exports.addProductToWishList = asyncHandler(async (req, res, nxt) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishList: req.body.productId }, //add product once
    },
    { new: true }
  );
  res.status(200).json({ msg: "Success To Add Product", data: user.wishList });
});

exports.removeProductFromWishList = asyncHandler(async (req, res, nxt) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishList: req.params.productId }, //add product once
    },
    { new: true }
  );
  res
    .status(200)
    .json({
      msg: "Success To Remove Product from wish list",
      data: user.wishList,
    });
});

exports.getWishLoggedUserList = asyncHandler(async (req, res, nxt) => {
  const user = await userModel.findById(req.user._id).populate("wishList");
  res
    .status(200)
    .json({ NOProductsInWishList: user.wishList.length, data: user.wishList });
});
