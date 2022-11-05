const User = require("../models/user.js");

const register = async (req, res) => {
  const { username, name, password, lat, lng, car_type, avatar, phone } = req.body;
  await User.create({
    username,
    name,
    password,
    lat,
    lng,
    car_type,
    avatar,
    phone
  });
  res.status(201).send({ message: "Register driver successfully" });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    res.status(400).send({ error: "Username and password is required" });
    return;
  }
  const user = await User.findOne({ username, password });
  if (user) {
    const token = user.generateAuthToken(user._id);
    res.status(200).send({ token });
    return;
  }
  res.status(400).send({ error: "Invalid credentials" });
};

const getUser = (req, res) => {
  res.status(200).send(req.user);
};

const getById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(401).send({ message: "Id is required" });
    return;
  }
  const user = await User.findById(id).select("-password");
  res.status(200).send({ user });
};

const update = async (req, res) => {
  const { id } = req.params;
  const { lat, lng } = req.body;
  if (!id) {
    res.status(401).send({ message: "Id is required" });
    return;
  }
  await User.findByIdAndUpdate(id, { lat, lng });
  res.status(200).send({ message: "Update user info successfully" });
};

module.exports = { register, login, getUser, getById, update };
