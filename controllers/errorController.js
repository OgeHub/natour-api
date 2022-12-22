/* eslint-disable node/no-unsupported-features/es-syntax */
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `${err.keyValue.name} is an existing tour, use another name`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again!', 401);

const handleExpiredJWTError = () =>
  new AppError('Your token has expired. Please login again', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  if (err.name === 'CastError') {
    err = handleCastErrorDB(err);
    sendErrorDev(err, res);
  }

  if (err.code === 11000) {
    err = handleDuplicateFieldsDB(err);
    sendErrorDev(err, res);
  }

  if (err.name === 'ValidationError') {
    err = handleValidationErrorDB(err);
    sendErrorDev(err, res);
  }

  if (err.name === 'JsonWebTokenError') {
    err = handleJWTError();
    sendErrorDev(err, res);
  }

  if (err.name === 'TokenExpiredError') {
    err = handleExpiredJWTError();
    sendErrorDev(err, res);
  }
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  return sendErrorDev(err, res);
};
