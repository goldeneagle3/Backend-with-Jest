const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxLength: 218,
      required: [true, 'Provide a valid name , please'],
    },
    location: {
      type: String,
      minlength: 3,
      maxLength: 218,
      required: [true, 'Provide a valid location , please'],
    },
    cost: {
      type: Number,
      minlength: 0,
      default: 0,
    },
    rating: {
      type: Number,
      minlength: 0,
      maxLength: 5,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', RestaurantSchema);
