const mongoose = require("mongoose");
const { Schema } = mongoose; // Same as "const Schema = mongoose.Schema;"

const userSchema = new Schema({
  googleId: String // Why is this valid JavaScript?!
});

mongoose.model("users", userSchema);
