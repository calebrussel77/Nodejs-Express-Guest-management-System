var express = require('express');
var router = express.Router();
const User = require('../models/User.model');
const checkAuth = require('../middlewares/check-auth');

/* GET SINGLE user Info. */
router.get('/', checkAuth, (req, resp, next) => {
  User.findById(req.userData.id)
    .select('-password')
    .then(user => {
      return resp.status(200).json({user});
    })
    .catch(err => {
      return resp.status(500).json({msg: err.message});
    });
});

module.exports = router;
