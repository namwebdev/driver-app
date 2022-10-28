const express = require("express");
const { getUser, getById } = require("../controllers/user.controllers");

const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.get("/:id", getById);

module.exports = userRouter;
