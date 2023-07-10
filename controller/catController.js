const asyncHandler = require("express-async-handler");
const { uuid } = require("uuidv4");
const sharp = require("sharp");
const categoryModel = require("../Models/categoryModel");
const factory = require("./handlerFactory");
const { uploadSingleFile } = require("../middelwares/uploadFiles");

//image Processing
exports.resizeImage = asyncHandler(async (req, res, nxt) => {
  // console.log(req.file);
  if (req.file) {
    const fileName = `cat-${uuid()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`upload/cats/${fileName}`);
    req.body.image = fileName;
  }
  nxt();
});

//upload single image
exports.uploadCatImage = uploadSingleFile("image");
// upload.single('image');

exports.getCats = factory.getAll(categoryModel);

//get specific cat
exports.getCat = factory.getOne(categoryModel);

exports.createCat = factory.createOne(categoryModel);

exports.updateCat = factory.updateOne(categoryModel);

exports.deleteCat = factory.deleteOne(categoryModel);
