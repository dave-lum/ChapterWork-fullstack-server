const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null /*no errors*/, user.id /*the Mongo id, not the Google ID*/);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    if (user) {
      done(null /*no errors*/, user);
    } else {
      done("No user found", null);
    }
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientId,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          // Already have this login
          done(null /*no error*/, existingUser);
        } else {
          // No user exists yet
          new User({ googleId: profile.id })
            .save()
            .then(newUser => done(null, newUser));
        }
      });
    }
  )
);
