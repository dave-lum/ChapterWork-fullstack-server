const passport = require("passport");

module.exports = expressApp => {
  //----------------------------------------------------------------------------------------------------
  // Google Authentication
  //----------------------------------------------------------------------------------------------------
  expressApp.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );
  expressApp.get("/auth/google/callback", passport.authenticate("google"));

  //----------------------------------------------------------------------------------------------------
  // "Dave" Authentication
  //----------------------------------------------------------------------------------------------------
  expressApp.get("/auth/dave", passport.authenticate("dave-strategy", {}));
  expressApp.get("/auth/dave/callback", passport.authenticate("dave-strategy"));

  //----------------------------------------------------------------------------------------------------
  // Generic API methods to aid in debugging
  //----------------------------------------------------------------------------------------------------
  expressApp.get("/api/logout", (req, res) => {
    var deadUser = req.user;
    req.logout();
    res.send(`Signed out the user: ${deadUser}`);
  });

  expressApp.get("/api/current-user", (req, res) => {
    res.send(`The current user is: ${req.user}`);
  });
};
