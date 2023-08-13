const express = require("express");
const ProductController = require("../controller/productController");

const router = express.Router();
const productValidator = require("../validator/productValidation");
const reviewRoute = require("./reviewRoute");

//nested route
router.use("/:productId/reviews", reviewRoute);

// const subCatRoute=require("./subCatRoute");
router
  .route("/")
  .get(ProductController.getProducts)

  .post(
    ProductController.uploadProductImages,
    ProductController.resizeProductImages,
    productValidator.createProductValidator,
    ProductController.createProduct
  );

//nested route
// router.use('/:category/subcats',subCatRoute);

router
  .route("/:id")
  .get(productValidator.getProductValidator, ProductController.getProduct);

router.put(
  "/:id",
  ProductController.uploadProductImages,
  ProductController.resizeProductImages,
  productValidator.updateProductValidator,
  ProductController.updateProduct
);

router.delete(
  "/:id",
  productValidator.deleteProductValidator,
  ProductController.deleteProduct
);

module.exports = router;
