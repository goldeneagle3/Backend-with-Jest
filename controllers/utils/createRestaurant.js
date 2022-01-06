const Restaurant = require('./../../models/restaurant.model.js');
const { BadRequestError } = require('./../../errors');
const fs = require('fs');

module.exports = async function (
  name,
  location,
  cost,
  rating,
  photo,
  user
) {
  const ifExist = await Restaurant.findOne({ name });
  if (ifExist)
    throw new BadRequestError('This restaurant already exists.');

  const newRstrant = new Restaurant({
    name,
    location,
    cost,
    rating,
  });

  if (photo) {
    newRstrant.photo.data = fs.readFileSync(photo.filepath);
    newRstrant.photo.contentType = photo.mimetype;
  }

  newRstrant.createdBy = user;

  await newRstrant.save();

  return { restaurantId: newRstrant._id };
};
