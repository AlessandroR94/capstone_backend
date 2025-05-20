const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const generateToken = require('../utility/generateToken');

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          username: profile.id,
          nome: profile.name.givenName || 'Google',
          cognome: profile.name.familyName || 'User',
          email,
          password: profile.id + Date.now(),
        });
      }

      const token = generateToken(user._id);
      user.token = token;

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  })
);
