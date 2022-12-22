const User = require('../models/userModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getMe = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    user: req.user,
  });
};

const updateMe = catchAsync(async (req, res, next) => {
  // Check if user want to update password
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError('Wrong route, use /updateMyPassword instead.', 400)
    );
  }
  const filteredObj = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
  });
});

const getUser = factory.createOne(User);
const getAllUsers = factory.getAll(User);
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

module.exports = {
  getMe,
  getAllUsers,
  updateMe,
  deleteMe,
  getUser,
  updateUser,
  deleteUser,
};
