const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxLength: 20,
    required: [true, 'Provide a valid username , please'],
    unique: [true, 'This username already taken!'],
  },
  email: {
    type: String,
    required: [true, 'Provide a valid email , please'],
    unique: [true, 'This email already taken!'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Provide a valid password , please'],
  },
});

module.exports = mongoose.model('User', UserSchema);
