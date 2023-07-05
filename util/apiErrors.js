class ApiError extends Error {
  constructor(gMsg, msg, statusCode) {
    super(msg);
    (this.gMsg = gMsg), (this.statusCode = statusCode);
    this.status = `${statusCode}`.startsWith(4) ? "Fail" : "Error";
    this.isOpertational = true; //can predict it
  }
}
module.exports = ApiError;
