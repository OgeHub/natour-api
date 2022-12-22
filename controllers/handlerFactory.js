const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndRemove({ _id: req.params.id });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    return res.status(200).send({
      status: 'success',
      statusCode: 200,
      message: 'Document deleted successfully',
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    return res.status(200).send({
      status: 'success',
      statusCode: 200,
      message: 'Document updated successfully',
      data: doc,
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    return res.status(201).send({
      status: 'success',
      statusCode: 201,
      message: 'Tour created successfully',
      data: doc,
    });
  });

const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.id) filter = { _id: req.params.id };
    if (req.params.id && req.params.tourId)
      filter = {
        _id: req.params.id,
        tour: req.params.tourId,
      };
    let query = Model.findOne(filter);

    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    return res.status(200).send({
      status: 'success',
      statusCode: 200,
      message: 'Document retrieved successfully',
      data: doc,
    });
  });

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // Execute Query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    return res.status(200).send({
      status: 'success',
      statusCode: 200,
      message: 'Document retrieved successfully',
      results: doc.length,
      data: doc,
    });
  });

module.exports = { deleteOne, updateOne, createOne, getOne, getAll };
