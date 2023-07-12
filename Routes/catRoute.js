const express = require("express");
const catController = require("../controller/catController");

const router = express.Router();
const catVAlidator = require("../validator/catValidation");
const subCatRoute = require("./subCatRoute");
const { applySlugify } = require("../controller/handlerFactory");

const authContrller = require("../controller/authController");

router
  .route("/")
  .get(catController.getCats)
  .post(
    authContrller.protect,
    authContrller.allowedTo("admin", "manager"),
    catController.uploadCatImage,
    catController.resizeImage,
    catVAlidator.createCatValidator,
    catController.createCat
  );

//nested route
router.use("/:category/subcats", subCatRoute);

router.route("/:id").get(catVAlidator.getCatValidator, catController.getCat);

router.put(
  "/:id",
  catController.uploadCatImage,
  catController.resizeImage,
  catVAlidator.updateCatValidator,
  applySlugify,
  catController.updateCat
);
router.delete("/:id", catVAlidator.deleteCatValidator, catController.deleteCat);
module.exports = router;
