const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

const setTourUserID = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const getReview = factory.getOne(Review);
const getAllReviews = factory.getAll(Review);
const createReview = factory.createOne(Review);
const updateReview = factory.updateOne(Review);
const deleteReview = factory.deleteOne(Review);

module.exports = {
  createReview,
  getReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourUserID,
};
