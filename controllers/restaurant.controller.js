const { StatusCodes } = require('http-status-codes');
const formidable = require('formidable');
const fs = require('fs');
const extend = require('lodash/extend.js');

const createRestaurant = require('./utils/createRestaurant.js');
const Restaurant = require('./../models/restaurant.model.js');
const { BadRequestError, UnauthorizedError } = require('./../errors');
const searchRestaurant = require('./utils/searchRestaurant.js');

const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Could not uploaded photos',
      });
    }

    const user = req.auth._id;

    const { name, location, cost, rating } = fields;
    const { photo } = files;

    const { restaurantById } = createRestaurant(
      name,
      location,
      cost,
      rating,
      photo,
      user
    );

    res.json(restaurantById);
  });
};

const list = async (req, res) => {
  let restauranst = await Restaurant.find();
  res.status(StatusCodes.OK).json(restauranst);
};

const searchRest = async (req, res) => {
  const { name, location, cost, rating, numeric, sort } = req.query;

  if (name || location || cost || rating || numeric || sort) {
    const products = await searchRestaurant(
      name,
      location,
      cost,
      rating,
      numeric,
      sort
    );
    res.status(200).json(products);
  }

  // if (fields) {
  //   const fieldList = fields.split(',').join(' ');
  //   result = result.select(fieldList);
  // }

  // const page = Number(req.query.page) || 1;
  // const limit = Number(req.query.limit) || 10;
  // const skip = (page - 1) * limit;

  // result = result.skip(skip).limit(limit);
};

const restaurantById = async (req, res, next, id) => {
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    throw new BadRequestError('Restaurant not found!');
  }
  req.restaurant = restaurant;
  next();
};

const photo = (req, res) => {
  res.set('Content-Type', req.restaurant.photo.contentType);
  return res.send(req.restaurant.photo.data);
};

const read = (req, res) => {
  res.json(req.restaurant);
};

const update = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Photo could not be uploaded',
      });
    }
    let newRest = req.post;
    newRest = extend(newRest, fields);

    if (files.photo) {
      newRest.photo.data = fs.readFileSync(files.photo.filepath);
      newRest.photo.contentType = files.photo.mimetype;
    }

    try {
      await newRest.save();
      res.status(StatusCodes.OK).json(newRest);
    } catch (error) {
      throw new BadRequestError('Not updated!');
    }
  });
};

const remove = async (req, res) => {
  let restaurant = req.restaurant;
  let deletedRestaurant = await restaurant.remove();
  deletedRestaurant.password = undefined;
  res.json(deletedRestaurant);
};

const isOwner = async (req, res, next) => {
  const isOwn = req.restaurant?.createdBy === req.auth?._id;
  if (!isOwn) {
    throw new UnauthorizedError(
      'You are not allowed to reach this resource.'
    );
  }
  next();
};

module.exports = {
  create,
  list,
  searchRest,
  restaurantById,
  photo,
  read,
  update,
  remove,
  isOwner,
};
