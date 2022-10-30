const express = require("express");
const { getUser, getById, update } = require("../controllers/user.controllers");

const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.get("/:id", getById);
userRouter.put("/update/:id", update);

module.exports = userRouter;
