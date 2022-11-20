const Trip = require("../models/trip");

const calcCrow = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};

// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180;
}

async function submitDriverForTrip(tripId, driverId) {
  const id = tripId;
  try {
    const tripToFind = await Trip.findById(id).select("driver_id");
    if (tripToFind.driver_id) return false;
    await Trip.findOneAndUpdate(
      { _id: id },
      { status: 1, driver_id: driverId }
    );
    return true
  } catch {
    console.error("submitDriverForTrip error");
    return false;
  }
}
module.exports = { calcCrow, submitDriverForTrip };
