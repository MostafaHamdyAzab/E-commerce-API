const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../util/apiErrors");
const ApiFeatures = require("../util/apiFeatures");

exports.deleteOne = (model) => async (req, res) => {
  const document = await model.findOneAndDelete({ _id: req.params.id });
  document.remove();
  // eslint-disable-next-line no-unused-expressions
  !document
    ? res.status(404).json({ msg: "No document Found" })
    : res.status(204).json({ msg: "document Deleted" });
};

exports.applySlugify = (req, res, nxt) => {
  req.body.slug = slugify(req.body.name);
  nxt();
};

exports.updateOne = (model) => (req, res, nxt) => {
  const { id } = req.params;
  model
    .findOneAndUpdate({ _id: id }, req.body, { new: true })
    .then((newDocument) => {
      newDocument.save();
      res.status(200).json({ data: newDocument });
    })
    .catch(() =>
      // process.env.MSG="Not found Category compat to this id";
      nxt(new ApiError("", "Not found Category compat to this id", 404))
    );
};

exports.createOne = (model) =>
  asyncHandler(async (req, res) => {
    const document = await model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (model, populateOpt) => async (req, res, nxt) => {
  const { id } = req.params;
  let query = model.findById({ _id: id });
  if (populateOpt) {
    query = query.populate(populateOpt);
  }
  const document = await query;
  if (!document) {
    nxt(new ApiError("", "No Document For This Id", 404));
  }
  res.status(200).json({ data: document });
};

exports.getAll = (model, modelName = "") =>
  asyncHandler(async (req, res, nex) => {
    let filter = {};

    if (req.filterObj) {
      filter = req.filterObj;
    }
    const NoDocuments = await model.countDocuments();
    const apiFeatures = new ApiFeatures(model.find(filter), req.query)
      .paginate(NoDocuments)
      .search(modelName)
      .filter()
      .limitFields()
      .sort();
    const document = await apiFeatures.mongooseQuery;
    res.status(200).json({
      results: document.length,
      paginationResult: apiFeatures.paginationResult,
      data: document,
    });
  });
