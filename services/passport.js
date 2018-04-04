const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");
const util = require("util");
const Strategy = require("passport-strategy"); // https://github.com/jaredhanson/passport-strategy

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
function DaveStrategy() {
  Strategy.call(this); // TODO: Is there a better-looking way to do this in ES6?
}

util.inherits(DaveStrategy, Strategy); // TODO: Is there a better way to do this in ES6?

// TODO: A better way in ES6?
DaveStrategy.prototype.authenticate = function(req, options) {
  const userName = req.query.uname;
  if (!userName) {
    // The first time we get called, there won't be any "uname" key in the query, which is a signal
    // that we should redirect to our authentication server.
    console.log(
      "^^^ Inside DaveStrategy for the first time, so redirecting to an external login server..."
    );
    const callbackUrl = `http://${req.headers.host}/auth/dave/callback`; // TODO: This cannot be the right way to make a new URL!
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    this.redirect(`http://localhost:60000/auth?callback=${encodedCallbackUrl}`);
  } else {
    // The second time we get called, the query contains a "uname" key to let us know who's logged in.
    console.log(
      `^^^ Inside DaveStrategy for the second time: the logged-in user is "${userName}"`
    );
    lookupOrCreateUser({ daveId: userName }, (errorMsg, userData) =>
      this.success(userData)
    );
  }
};

passport.use("dave-strategy", new DaveStrategy());
