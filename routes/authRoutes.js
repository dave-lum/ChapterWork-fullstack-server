const passport = require("passport");

module.exports = expressApp => {
  expressApp.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  expressApp.get("/auth/google/callback", passport.authenticate("google"));

  expressApp.get("/api/logout", (req, res) => {
    var deadUser = req.user;
    req.logout();
    res.send(`Signed out the user: ${deadUser}`);
  });

  expressApp.get("/api/current-user", (request, response) => {
    response.send(`The current user is: ${request.user}`);
  });
};
