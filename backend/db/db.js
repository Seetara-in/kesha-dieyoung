const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://localhost:27017");

const UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  fisrtName: String,
  lastName: String,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
