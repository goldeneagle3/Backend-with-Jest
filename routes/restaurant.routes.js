const express = require('express');

const restCtrl = require('./../controllers/restaurant.controller.js');
const authCtrl = require('./../controllers/auth.controller.js');

const router = express.Router();

router
  .route('/')
  .post(authCtrl.requireSignin, restCtrl.create)
  .get(restCtrl.list);

router.route('/search').get(restCtrl.searchRest);

router.route('/photo/:restaurantId').get(restCtrl.photo);

router
  .route('/:restaurantId')
  .get(restCtrl.read)
  .patch(authCtrl.requireSignin, restCtrl.isOwner, restCtrl.update)
  .delete(authCtrl.requireSignin, restCtrl.isOwner, restCtrl.remove);

router.param('restaurantId', restCtrl.restaurantById);

module.exports = router;
