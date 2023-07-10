class ApiError extends Error {
  constructor(gMsg, msg, statusCode) {
    super(msg);
    // eslint-disable-next-line no-unused-expressions, no-sequences
    (this.gMsg = gMsg), (this.statusCode = statusCode);
    this.status = `${statusCode}`.startsWith(4) ? "Fail" : "Error";
    this.isOpertational = true; //can predict it
  }
}
module.exports = ApiError;
