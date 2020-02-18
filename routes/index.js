var express = require ('express');
var router = express.Router ();
const checkAuth = require ('../middlewares/check-auth');
const User = require ('../models/User.model');

/* GET home page. */
router.get ('/home', checkAuth, (req, resp, next) => {
  console.log (req.userData);
  User.findById (req.userData.id)
    .select ('-password')
    .then (user => {
      resp.json (user);
    })
    .catch (err => {
      console.log (err.message);
    });
});

module.exports = router;
