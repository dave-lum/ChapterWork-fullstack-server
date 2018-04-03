const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const CustomStrategy = require("passport-custom");
const mongoose = require("mongoose");
const keys = require("../config/keys");
const util = require("util");
const Strategy = require("passport-strategy");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null /*no errors*/, user.id /*the Mongo id, not the Google ID*/);
});

passport.deserializeUser((id, done) => {
  console.log(`The logged-in user id is: ${id}`);
  User.findById(id).then(user => {
    if (user) {
      done(null /*no errors*/, user);
    } else {
      done("^^^ No user found", null);
    }
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientId,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
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

//----------------------------------------------------------------------------------------------------
function DaveStrategy() {
  Strategy.call(this);
}

util.inherits(DaveStrategy, Strategy);

DaveStrategy.prototype.authenticate = function(req, options) {
  console.log("^^^ Inside DaveStrategy!", req);
  var callbackUrl = `http://${req.headers.host}/continue`;
  var encodedCallbackUrl = encodeURIComponent(callbackUrl);
  this.redirect(`http://localhost:60000/auth?callback=${encodedCallbackUrl}`);
};

passport.use("dave-strategy", new DaveStrategy());

//passport.use(
//   new CustomStrategy((req, done) => {
//     console.log("^^^ CustomStrategy req: ", req);
//     console.log("^^^ CustomStrategy done: ", done);
//     User.findOne(
//       {
//         username: req.body.username
//       },
//       (err, user) => {
//         done(err, user);
//       }
//     );
//   })
// );
