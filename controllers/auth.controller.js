const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');

const User = require('./../models/user.model.js');
const {
  BadRequestError,
  UnauthenticatedError,
} = require('./../errors');

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password!');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials.');
  }
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user?.password
  );
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials.');
  }
  // compare password
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET
  );

  res.cookie('t', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(StatusCodes.OK).json({
    user: { _id: user._id, username: user.username },
    token,
  });
};

const signout = (req, res) => {
  res.clearCookie('t');
  return res.status('200').json({
    message: 'signed out',
  });
};

// Permissions

const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth',
  algorithms: ['sha1', 'RS256', 'HS256'],
});

const hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id === req.auth._id;

  if (!authorized) {
    return res.status('403').json({
      error: 'User is not authorized',
    });
  }

  next();
};

module.exports = {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
};
