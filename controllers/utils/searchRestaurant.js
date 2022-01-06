const Restaurant = require('./../../models/restaurant.model.js');

module.exports = function (
  name,
  location,
  cost,
  rating,
  numeric,
  sort
) {
  let queryObj = {};

  if (name) {
    queryObj.name = { $regex: name, $options: 'i' };
  }

  if (location) {
    queryObj.location = { $regex: location, $options: 'i' };
  }

  if (cost) {
    queryObj.cost = cost;
  }

  if (rating) {
    queryObj.rating = rating;
  }

  if (numeric) {
    const operatorMap = {
      '<': '$lt',
      '<=': '$lte',
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numeric.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['cost', 'rating'];
    filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObj[field] = { [operator]: Number(value) };
      }
    });
  }
  let result = Restaurant.find(queryObj);

  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('-created');
  }

  return result;
};
