const catRoute = require("./catRoute");
const subCatRoute = require("./subCatRoute");
const brandRoute = require("./brandRoute");
const productRoute = require("./productRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const reviewRoute = require("./reviewRoute");
const wishListRoute = require("./wishListRoute");
const addressRoute = require("./addressRoute");
const couponRoute = require("./couponRoute");
const cartRoute = require("./cartRoute");

const mountRoute = (app) => {
  app.use("/api/cat", catRoute);
  app.use("/api/subcat", subCatRoute);
  app.use("/api/brand", brandRoute);
  app.use("/api/product", productRoute);
  app.use("/api/user", userRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/review", reviewRoute);
  app.use("/api/wishList", wishListRoute);
  app.use("/api/addresses", addressRoute);
  app.use("/api/coupon", couponRoute);
  app.use("/api/cart", cartRoute);
};

module.exports = mountRoute;
