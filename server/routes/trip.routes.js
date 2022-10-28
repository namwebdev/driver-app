const express = require("express");
const { create, getById, update, get } = require("../controllers/trip.controller");

const tripRouter = express.Router();

tripRouter.get("/", get)
tripRouter.get("/:id", getById);
tripRouter.post("/create", create);
tripRouter.put("/update/:id", update)

module.exports = tripRouter;
