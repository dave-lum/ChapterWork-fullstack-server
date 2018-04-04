const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");
const DaveStrategy = require("./DaveStrategy");

const User = mongoose.model("users");

//----------------------------------------------------------------------------------------------------
// Generic functions to store and load users to/from the HTTP session, or cookie, or whatever!
//----------------------------------------------------------------------------------------------------
passport.serializeUser((user, done) => {
  done(
    null /*no errors*/,
    user.id /*the Mongo id, not the Google ID or the Dave ID*/
  );
});

passport.deserializeUser((id, done) => {
  console.log(`^^^ The logged-in user id is: ${id}`);
  User.findById(id).then(user => {
    if (user) {
      done(null /*no errors*/, user);
    } else {
      done("^^^ No user found", null);
    }
  });
});

//----------------------------------------------------------------------------------------------------
// Helper functions
//----------------------------------------------------------------------------------------------------
/**
 * Queries for a User in MongoDB and returns it if found. If not found, creates it.
 *
 * @param userInfo user info as an object; serves as both the Mongo query as well as the data to store
 * @param done callback function that's invoked after the Mongo operation(s) have completed. Should
 *             have a signature like `callback(errorMessage, userInfo)`.
 */
function lookupOrCreateUser(userInfo, done) {
  console.log(`^^^ Looking for a DB user: ${JSON.stringify(userInfo)}`);
  User.findOne(userInfo).then(existingUser => {
    if (existingUser) {
      // Already have this login
      console.log("^^^ DB user already existed :)");
      done(null /*no error*/, existingUser);
    } else {
      // No user exists yet
      console.log("^^^ DB user did not exist, so creating it...");
      new User(userInfo).save().then(newUser => done(null, newUser));
    }
  });
}

//----------------------------------------------------------------------------------------------------
// Google Strategy
//----------------------------------------------------------------------------------------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientId,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      lookupOrCreateUser({ googleId: profile.id }, done);
    }
  )
);

//----------------------------------------------------------------------------------------------------
// Dave Strategy
//----------------------------------------------------------------------------------------------------
passport.use(
  "dave-strategy",
  new DaveStrategy({ host: "localhost", port: 60000 }, (userName, done) => {
    lookupOrCreateUser({ daveId: userName }, (errorMsg, userData) =>
      done(userData)
    );
  })
);
