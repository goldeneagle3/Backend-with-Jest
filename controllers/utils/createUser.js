const bcrypt = require('bcryptjs');

const User = require('./../../models/user.model.js');
const { BadRequestError } = require('./../../errors');

module.exports = async function (username, email, password) {
  const ifExist = await User.findOne({
    email,
  });
  if (ifExist) throw new BadRequestError('This user already exists.');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username: username,
    email: email,
    password: hashedPassword,
  });
  await newUser.save();

  return { userId: newUser._id };
};
