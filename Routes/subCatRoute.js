const express = require("express");
const subCatController = require("../controller/subCatController");
const { applySlugify } = require("../controller/handlerFactory");

const authContrller = require("../controller/authController");
//to access parameter in another routes(catId)
const router = express.Router({ mergeParams: true });
const subCatValidator = require("../validator/subCatValidation");

// router.post('/',subCatValidator.createsubCatValidator,subCatController.createSubCat);

router
  .route("/")
  .post(
    authContrller.protect,
    authContrller.allowedTo("admin"),
    subCatValidator.createsubCatValidator,
    subCatController.createSubCat
  )
  .get(subCatController.getSubCats);

router.get(
  "/:id",
  subCatValidator.getsubCatValidator,
  subCatController.getsubCat
);

router.put(
  "/:id",
  authContrller.protect,
  authContrller.allowedTo("admin"),
  subCatValidator.updatesubCatValidator,
  applySlugify,
  subCatController.updateSubCat
);

router.delete(
  "/:id",
  authContrller.protect,
  authContrller.allowedTo("admin"),
  subCatValidator.deletesubCatValidator,
  subCatController.deleteSubCat
);

module.exports = router;
