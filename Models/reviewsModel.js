const mongoose = require("mongoose");
const productModel = require("./productModel");
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

reviewsModel.statics.calcAvgRatingAndQunt = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } }, //first stage
    {
      $group: {
        //return group has this proterties
        _id: "product",
        avgRating: { $avg: "$rating" },
        ratingQntity: { $sum: 1 },
      },
    },
  ]);
  // console.log(result);
  if (result.length > 0) {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRating,
      ratingsQuantity: result[0].ratingQntity,
    });
  } else {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewsModel.post("save", async function () {
  await this.constructor.calcAvgRatingAndQunt(this.product);
});

reviewsModel.pre(/^find/, function (nxt) {
  this.populate({ path: "user", select: "userName" });
  nxt();
});

module.exports = mongoose.model("Review", reviewsModel);
