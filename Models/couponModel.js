const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon Name Is Required"],
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, "Expire Date Is Required"],
    },
    discount: {
      type: Number,
      required: [true, "Conpon Discount value Is Required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
