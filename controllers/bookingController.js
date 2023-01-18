const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
// const factory = require('./handlerFactory');

const getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ _id: req.params.tourId });

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: tour.name,
            description: tour.summary,
            images: ['https://www.natours.dev/img/tours/tour-1-cover.jpg'],
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    customer_email: req.user.email,
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}`,
    cancel_url: `${req.protocol}://${req.get('host')}`,
  });

  res.status(200).json({
    status: 'success',
    message: 'Session created successfully',
    data: session,
  });
});

module.exports = {
  getCheckoutSession,
};
