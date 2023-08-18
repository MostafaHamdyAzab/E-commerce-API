const path = require("path");
const express = require("express");

const app = express();
const db = require("./config/db");
const dotenv = require("dotenv");
const morgan = require("morgan");
const catRoute = require("./Routes/catRoute");
const subCatRoute = require("./Routes/subCatRoute");
const brandRoute = require("./Routes/brandRoute");
const productRoute = require("./Routes/productRoute");
const userRoute = require("./Routes/userRoute");
const authRoute = require("./Routes/authRoute");
const reviewRoute = require("./Routes/reviewRoute");
const wishListRoute = require("./Routes/wishListRoute");
const addressRoute = require("./Routes/addressRoute");

const ApiError = require("./util/apiErrors");
const globalError = require("./middelwares/errors");
// app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "upload")));
dotenv.config({ path: "config.env" });
app.use(morgan("dev"));
app.use("/api/cat", catRoute);
app.use("/api/subcat", subCatRoute);
app.use("/api/brand", brandRoute);
app.use("/api/product", productRoute);
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/review", reviewRoute);
app.use("/api/wishList", wishListRoute);
app.use("/api/addresses", addressRoute);

app.all("*", (req, res, nxt) => {
  //if url not found
  nxt(new ApiError(`cant find Route ${req.originalUrl}`, "", 400));
});

// app.use((err, req, res, nxt) => {
//   console.log("eeee");
//   res.status(400).json({ err });
// });

app.use(globalError); //this For All Express Errors

const server = app.listen(process.env.PORT, () => {
  console.log("App LOading..");
  console.log(`Running On Port ${process.env.port}`);
});

//this for errors out express as dbconn err or
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection ${err.name}|${err.message}`);
  server.close(() => {
    //if any process is run first terminate it and then exit
    process.exit(1);
  });
});
