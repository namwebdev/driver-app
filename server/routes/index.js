const express = require("express");
const rootRouter = express.Router();
const { register, login } = require("../controllers/user.controllers");
const authorize = require("../middlewares/auth");
const tripRouter = require("./trip.routes");
const userRouter = require("./user.routes");

rootRouter.get("/", (req, res) => res.send("API is running.."));

// auth routes
rootRouter.post("/register", register);
rootRouter.post("/login", login);

rootRouter.use("/user", authorize, userRouter);
rootRouter.use("/trip", authorize, tripRouter)

module.exports = { rootRouter };
