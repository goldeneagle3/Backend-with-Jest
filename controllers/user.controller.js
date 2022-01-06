const createUser = require('./utils/createUser.js');
const User = require('./../models/user.model.js');
const { BadRequestError } = require('./../errors');

const create = async (req, res) => {
  const { username, email, password } = req.body;

  const { userId } = await createUser(username, email, password);

  res.json({ userId });
};

const userByID = async (req, res, next, id) => {
  let profile = await User.findById(id);
  if (!profile) {
    throw new BadRequestError('User not found!');
  }
  profile.password = undefined;
  req.profile = profile;
  next();
};

const read = (req, res) => {
  req.profile.password = undefined;
  res.json(req.profile);
};

const update = async (req, res) => {
  let updatedUser = await User.findByIdAndUpdate(
    req.profile._id,
    req.body,
    { new: true, runValidators: true }
  );
  updatedUser.password = undefined;
  res.status(200).json(updatedUser);
};

const remove = async (req, res) => {
  let user = req.profile;
  let deletedUser = await user.remove();
  deletedUser.password = undefined;
  res.json(deletedUser);
};

module.exports = {
  create,
  userByID,
  read,
  update,
  remove,
};
