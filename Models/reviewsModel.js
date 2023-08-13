const mongoose = require("mongoose");
const reviewsModel = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, "Min rate is 1.0"],
      max: [5, "Min rate is 5.0"],
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "Review Must Belong To User"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
      required: [true, "Review Must Belong To Product"],
    },
  },
  { timestamps: true }
);
reviewsModel.pre(/^find/, function (nxt) {
  this.populate({ path: "user", select: "userName" });
  nxt();
});

module.exports = mongoose.model("Review", reviewsModel);
