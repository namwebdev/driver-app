const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const user = mongoose.Schema({
  username: { type: "String", required: true },
  password: { type: "String", required: true },
  name: { type: "String", required: true },
  lat: { type: "Number", required: true },
  lng: { type: "Number", required: true },
  car_type: { type: "Number", required: true },
  avatar: { type: "String", required: true },
  phone: { type: "String", required: true },
});

user.methods.generateAuthToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

const User = mongoose.model("Users", user);
module.exports = User;
