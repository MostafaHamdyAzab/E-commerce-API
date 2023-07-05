const sendErrForDev = (err, res) => {
  console.log("bbb");
  res.status(err.statusCode).json({
    gMes: err.gMes, //this if url is error
    status: err.status,
    error: err,
    msg: err.message,
    stack: err.stack,
  });
};

const sendErrForProduction = (err, res) => {
  res.status(err.statusCode).json({
    gMes: err.gMsg, //this if url is error
    status: err.status,
  });
};

const globalError = (err, req, res, nxt) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  if (process.env.MODE === "dev") {
    sendErrForDev(err, res);
  } else if (process.env.MODE === "prod") {
    sendErrForProduction(err, res);
  }
};

module.exports = globalError;
