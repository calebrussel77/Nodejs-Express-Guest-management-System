const router = require('express').Router();
const checkAuth = require('../middlewares/check-auth');
const Guest = require('../models/Guest.model');
const {check, validationResult} = require('express-validator');

/*
 * GET all Guests
 */

router.get('/', checkAuth, (req, resp) => {
  console.log(req);

  Guest.find({user_id: req.userData.id})
    .then(guests => {
      return resp.status(200).json({guests: guests});
    })
    .catch(err => {
      return resp
        .status(500)
        .json({msg: 'An error occured,please try again or refresh the page !'});
    });
});

/*
 * POST a new Guest
 */
router.post(
  '/',
  checkAuth,
  [
    check('name', 'Please provide a name')
      .not()
      .isEmpty(),
    check('phone', 'Please provide phone')
      .not()
      .isEmpty(),
  ],
  (req, resp) => {
    console.log(req);

    const errors = validationResult(req);
    const {name, phone, dietary, isConfirmed} = req.body;

    if (!errors.isEmpty()) {
      return resp.status(400).json({error: errors.array()});
    }
    const guest = new Guest({
      user_id: req.userData.id,
      name,
      phone,
      dietary,
      isConfirmed,
    });
    guest
      .save()
      .then(guest => {
        console.log(guest);
        return resp.status(200).json({
          msg: 'You have successfully add a new guest !',
          guest: guest,
        });
      })
      .catch(err => {
        return resp
          .status(500)
          .json({msg: 'An error occured,please try again !'});
      });
  }
);

/*
 * DELETE one Guest by id
 */
router.delete('/:id', checkAuth, (req, resp) => {
  console.log(req.params.id);
  Guest.findById({_id: req.params.id})
    .then(guest => {
      if (!guest) {
        return resp.status(404).json({msg: 'Guest not found !'});
      }
      Guest.findByIdAndDelete({_id: req.params.id}).then(() => {
        return resp.status(200).json({
          msg: 'You have successfully delete the selected guest!',
        });
      });
    })
    .catch(err => {
      return resp
        .status(500)
        .json({msg: 'An error occured,please try again !', error: err.msg});
    });
});

/*
 * UPDATE one Guest by id
 */
router.put('/:id', checkAuth, (req, resp) => {
  const {name, phone, dietary, isConfirmed} = req.body;
  const updatedGuest = {name, phone, dietary, isConfirmed};

  Guest.findById({_id: req.params.id})
    .then(guest => {
      if (!guest) {
        return resp.status(404).json({msg: 'Guest not found !'});
      }
      Guest.findByIdAndUpdate(req.params.id, updatedGuest).then(() => {
        return resp.status(200).json({
          msg: 'You have successfully update the selected guest!',
        });
      });
    })
    .catch(err => {
      return resp
        .status(500)
        .json({msg: 'An error occured,please try again !', error: err.msg});
    });
});

module.exports = router;
