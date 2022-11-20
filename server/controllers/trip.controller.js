const Trip = require("../models/trip");

const get = async (req, res) => {
  const { client_phone_number, driver_id } = req.query;
  if (client_phone_number) {
    const trips = await Trip.find({ client_phone_number, status: 2 }).limit(5).select(
      "destination"
    );
    res.status(200).send({ trip: trips });
    return;
  }
  if (driver_id) {
    const trips = await Trip.find({ driver_id })
      .select("departure destination created_at")
      .sort("-created_at") // -1 for descending sort
      .limit(5);
    res.status(200).send({ trip: trips });
    return;
  }
  const trips = await Trip.find().select("destination");
  res.status(200).send({ trip: trips });
};

const getById = async (req, res) => {
  const { id } = req.params;
  const trip = await Trip.findById(id).select(
    "departure_lng _id departure_lat departure destination"
  );
  if (trip) {
    res.status(200).send({ trip });
    return;
  }
  res.status(500).send({ message: e });
};

const create = async (req, res) => {
  const {
    departure,
    departure_lat,
    departure_lng,
    destination,
    driver_id,
    client_id,
    status,
    client_phone_number,
    car_type,
  } = req.body;
  try {
    const trip = await Trip.create({
      departure,
      departure_lat,
      departure_lng,
      destination,
      driver_id: driver_id || null,
      client_id: client_id || null,
      status: status || 0,
      client_phone_number,
      car_type,
    });
    res.status(201).send({ trip });
  } catch (e) {
    res.status(500).send({ message: e });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(401).send({ message: "Trip ID is required" });
    return;
  }
  const { status, client_id, driver_id } = req.body;

  const filter = { _id: id };
  if (status) {
    const update = {
      status,
      ...(driver_id && { driver_id }),
      ...(client_id, { client_id }),
    };
    await Trip.findOneAndUpdate(filter, update);
    res.status(200).send({ message: "Update trip successfully" });
    return;
  }
  res.status(400).send({ message: "Bad request" });
};
module.exports = { get, getById, create, update };
