const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  registerUser,
  loginUser,
  forgotUsername,
  forgotPassword,
  resetPassword
} = require('../apisettings/authController');

// Registrazione e login classico
router.post('/register', registerUser);
router.post('/login', loginUser);

// Google 
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

// Recupero credenziali
router.post('/forgot-username', forgotUsername);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
