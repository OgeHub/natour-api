const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION: Shutting down💥...');
  process.exit(1);
});

const app = require('./app');

const DB = `mongodb+srv://${process.env.USER}:${process.env.DATABASE_PASSWORD}${process.env.DATABASE}`;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connected successfully'));

const port = 3000;
const server = app.listen(port, () =>
  console.log(`App running on port ${port}...`)
);

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION: Shutting down💥...');
  server.close(() => {
    process.exit(1);
  });
});
