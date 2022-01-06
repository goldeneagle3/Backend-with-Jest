require('dotenv').config();
require('express-async-errors');
// const path = require('path');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');

const express = require('express');
// DataBase and Middlewares
const connectDB = require('./db/connect.js');
const {
  rateLimiterUsingThirdParty,
} = require('./middlewares/rateLimiter.js');

// Routes
const authRoutes = require('./routes/auth.routes.js');
const userRoutes = require('./routes/user.routes.js');
const restRoutes = require('./routes/restaurant.routes.js');

// error handler
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
  })
);
app.set('trust proxy', 1);
app.use(helmet());
app.use(xss());
app.use(cookieParser());

// API-DOCUMENTATION

app.get('/', (req, res) => {
  res.send('<h1>Restaurants API</h1>');
});

// routes
app.use('/api/v1/auth', rateLimiterUsingThirdParty, authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/restaurants', restRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
