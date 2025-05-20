const express = require('express');
const passport = require('passport');
const router = express.Router();
const { registerUser, loginUser } = require('../apisettings/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    res.json({
      message: 'Accesso con Google riuscito',
      token: req.user.token
    });
  }
);

module.exports = router;
