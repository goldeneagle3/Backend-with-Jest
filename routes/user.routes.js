const express = require('express');

const userCtrl = require('./../controllers/user.controller.js');
const authCtrl = require('./../controllers/auth.controller.js');

const router = express.Router();

router.route('/').post(userCtrl.create);

router
  .route('/:userId')
  .get(authCtrl.requireSignin, userCtrl.read)
  .patch(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.update
  )
  .delete(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.remove
  );

router.param('userId', userCtrl.userByID);

module.exports = router;
