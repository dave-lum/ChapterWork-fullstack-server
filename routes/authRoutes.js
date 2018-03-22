const passport = require("passport");

module.exports = expressApp => {
  expressApp.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  expressApp.get("/auth/google/callback", passport.authenticate("google"));
};
