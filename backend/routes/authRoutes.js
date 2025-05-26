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
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      if (err) {
        console.error('❌ Errore autenticazione:', err);
        return res.redirect('http://localhost:5173/login?error=auth');
      }

      if (!user) {
        console.error('❌ Utente mancante!');
        return res.redirect('http://localhost:5173/login?error=nouser');
      }

      console.log('✅ Utente autenticato:', user);

      const token = user.token;
      if (!token) {
        console.error('❌ Token assente!');
        return res.redirect('http://localhost:5173/login?error=notoken');
      }

      console.log('✅ Token estratto:', token);
      res.redirect(`http://localhost:5173/google-success?token=${token}`);
    })(req, res, next);
  }
);



// Recupero credenziali
router.post('/forgot-username', forgotUsername);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
