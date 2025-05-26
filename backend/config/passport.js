require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const generateToken = require('../utility/generateToken');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            username: profile.id, // provvisorio, verrà aggiornato dopo
            nome: profile.name.givenName || 'Google',
            cognome: profile.name.familyName || 'User',
            email,
            password: profile.id + Date.now(), // dummy password
            isProfileComplete: false
          });
        }

        const token = generateToken(user);

        // 👇 costruiamo un oggetto manuale da passare al callback
        const userWithToken = {
          _id: user._id,
          username: user.username,
          nome: user.nome,
          cognome: user.cognome,
          email: user.email,
          imageUrl: user.imageUrl,
          isProfileComplete: user.isProfileComplete,
          token
        };

        done(null, userWithToken);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
