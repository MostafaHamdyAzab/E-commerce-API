const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../util/apiErrors");
const ApiFeatures = require("../util/apiFeatures");

exports.deleteOne = (model) => async (req, res) => {
  const document = await model.findOneAndDelete({ _id: req.params.id });
  // eslint-disable-next-line no-unused-expressions
  !document
    ? res.status(404).json({ msg: "No Category Found" })
    : res.status(204).json({ msg: "Cat Deleted" });
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

exports.getOne = (model) => (req, res, nxt) => {
  const { id } = req.params;
  model
    .findById({ _id: id })
    .then((document) => {
      res.status(200).json({ data: document });
    })
    .catch(() => nxt(new ApiError("", process.env.MSG, 404)));
};

exports.getAll = (model, modelName = "") =>
  asyncHandler(async (req, res, nex) => {
    const NoDocuments = await model.countDocuments();
    const apiFeatures = new ApiFeatures(model.find(), req.query)
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
