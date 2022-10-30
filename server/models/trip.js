const mongoose = require("mongoose");

const trip = mongoose.Schema(
  {
    departure: { type: "String", required: true },
    departure_lat: { type: "Number", required: true },
    departure_lng: { type: "Number", required: true },
    destination: { type: "String", required: true },
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    client_phone_number: { type: "String" },
    driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    status: {
      type: "Number",
    },
    car_type: { type: "Number", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Trip = mongoose.model("Trips", trip);
module.exports = Trip;
