const mongoose = require("mongoose");
const { Schema } = mongoose; // Same as "const Schema = mongoose.Schema;"

const userSchema = new Schema({
  googleId: String, // TODO: Why is this valid JavaScript?!
  daveId: String
});

mongoose.model("users", userSchema);
