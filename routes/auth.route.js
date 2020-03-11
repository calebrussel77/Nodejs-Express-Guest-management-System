var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator');
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middlewares/check-auth');

/* GET SINGLE user Info. */
router.get('/user', checkAuth, (req, resp, next) => {
  User.findById(req.userData.id)
    .select('-password')
    .then(user => {
      return resp.status(200).json({user: user});
    })
    .catch(err => {
      return resp.status(500).json({msg: err.message});
    });
});

/* POST user credentials to register. */
router.post(
  '/register',
  [
    check('name', 'Please Provide a name')
      .not()
      .isEmpty(),
    check('email', 'Please Provide a valid email address').isEmail(),
    check('password', 'Please Provide 06 charactere long password').isLength({
      min: 6,
    }),
  ],
  (req, resp, next) => {
    const errors = validationResult(req);
    const {name, email, password} = req.body;

    if (!errors.isEmpty()) {
      return resp.status(400).json({msg: errors.array()});
    }
    User.findOne({email})
      .then(user => {
        if (user) {
          return resp.status(400).json({msg: 'User already exists'});
        }
        user = new User({
          name,
          email,
          password,
        });

        bcrypt.hash(password, 10).then(hashedpassword => {
          user.password = hashedpassword;
          user.save();

          const payload = {
            id: user._id,
          };

          jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
              expiresIn: 3600,
            },
            (err, token) => {
              if (err) throw err;
              return resp.status(200).json({
                token,
              });
            }
          );
        });
      })
      .catch(err => {
        return resp.status(500).json({msg: err.message});
      });
  }
);

/* POST user credentials to s ign in */
router.post(
  '/login',
  [
    check('email', 'Please Provide a valid email address').isEmail(),
    check('password', 'Please Provide 06 charactere long password').isLength({
      min: 6,
    }),
  ],
  (req, resp, next) => {
    const errors = validationResult(req);
    const {email, password} = req.body;

    if (!errors.isEmpty()) {
      return resp.status(400).json({error: errors.array()});
    }
    User.findOne({email})
      .then(user => {
        if (!user) {
          return resp.status(400).json({msg: 'Invalid credentials !'});
        } else {
          bcrypt.compare(password, user.password).then(match => {
            if (!match) {
              return resp
                .status(400)
                .json({msg: 'email or password are/is not correct'});
            }
            const payload = {
              id: user._id,
            };

            jwt.sign(
              payload,
              process.env.SECRET_KEY,
              {
                expiresIn: 3600,
              },
              (err, token) => {
                if (err) throw err;
                return resp.status(200).json({
                  token: token,
                  user: {userId: user._id, userName: user.name},
                  expiresIn: 3600,
                });
              }
            );
          });
        }
      })
      .catch(err => {
        return resp.status(500).json({msg: err.message});
      });
  }
);

module.exports = router;
