const path = require("path");
const express = require("express");
const app = express();
const db = require("./config/db");
const dotenv = require("dotenv");
const morgan = require("morgan");
const monuntRoute = require("./Routes/indexRoute");
const ApiError = require("./util/apiErrors");
const globalError = require("./middelwares/errors");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  message: "Too Many Requests,please try After 15 min",
});
app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "upload")));
dotenv.config({ path: "config.env" });
app.use(morgan("dev"));

app.use(cors()); //enable other domain to access my api
app.options("*", cors());

app.use(limiter);
monuntRoute(app);
app.use(compression);
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
