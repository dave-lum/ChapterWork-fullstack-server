const Strategy = require("passport-strategy"); // https://github.com/jaredhanson/passport-strategy

/**
 * A custom Passport Strategy that targets a fancy-pants, Dave-style authentication server!
 */
class DaveStrategy extends Strategy {
  // TODO: What's our Appian policy on doc comments? What are good industry policies?
  /**
   * Creates an instance.
   *
   * @param options An object with the following keys:
   *                `host` - the host where the auth server is running (default is localhost)
   *                `port` - the port that the auth server is listening (default is 60000)
   *
   * @param postAuthCallback A callback function that's invoked after a user has successfully
   *                logged in. Should have a signature like `postAuthCallback(userName, done)`
   *                where `userName` is the name of the authenticated user and `done` is a callback
   *                that your callback should invoke when it has constructed its version of the
   *                session user, which is the only argument passed to `done`.
   */
  constructor(options, postAuthCallback) {
    super();
    this.host = options.host || "localhost";
    this.port = options.port || 60000;
    this.postAuthCallback = postAuthCallback;
  }

  // TODO: When I'm debugging, why can't I see other stack frames' local vars?

  //@Override   // TODO: Is there some standard way of indicating this in JS?
  authenticate(req, options) {
    const userName = req.query.uname;
    if (!userName) {
      // The first time we get called, there won't be any "uname" key in the query, which is a signal
      // that we should redirect to our authentication server.
      console.log(
        "^^^ Inside DaveStrategy for the first time, so redirecting to an external login server..."
      );
      // TODO: This cannot be the right way to make a new URL!
      const callbackUrl = `http://${req.headers.host}/auth/dave/callback`;
      const encodedCallbackUrl = encodeURIComponent(callbackUrl);
      this.redirect(
        `http://${this.host}:${this.port}/auth?callback=${encodedCallbackUrl}`
      );
    } else {
      // The second time we get called, the query contains a "uname" key to let us know who's logged in.
      console.log(
        `^^^ Inside DaveStrategy for the second time: the logged-in user is "${userName}"`
      );
      this.postAuthCallback(userName, userData => {
        this.success(userData);
      });
    }
  }
}

module.exports = DaveStrategy;
