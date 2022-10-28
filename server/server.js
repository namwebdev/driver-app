const dotenv = require("dotenv");
const { connectDB } = require("./config");
const express = require("express");
const cors = require("cors");
const { rootRouter } = require("./routes");
const { calcCrow, submitDriverForTrip } = require("./services/location");
const Trip = require("./models/trip");
const { sendSMS } = require("./services/sms");

const PORT = process.env.PORT || 9000;

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api", rootRouter);

const server = app.listen(
  PORT,
  console.info(`Server is running on port ${PORT}`)
);

//socket
const io = require("socket.io")(server, {
  pingTimeOut: 10000,
  cors: {
    origin: process.env.FRONT_END_URL,
  },
});

let drivers_location = [];
let timer = null;
const MAX_DISTANCE = 5;
const MAX_DRIVER_ACCPET = 2;

io.on("connection", (socket) => {
  // console.info("a user connected");

  socket.on("setup", (user_id) => {
    socket.join(user_id);
    console.info(`${user_id}` + " joined");
  });

  socket.on("book-car", (trip_id) => {
    io.emit("book-car", trip_id);
  });

  socket.on("send-location", (info) => {
    const driver_info = JSON.parse(info);
    drivers_location.push(driver_info);
    if (timer) return;

    timer = setTimeout(sendTripInfo, 500);
  });

  socket.on("submit-trip", async (trip_info) => {
    if (drivers_location.length >= 2) return;
    const trip = JSON.parse(trip_info);
    drivers_location.push(trip);
    io.emit("send-driver-info", trip.driver.id);
    if (drivers_location.length < 2) return;

    const tripId = drivers_location[0].trip_id;
    const driverId = await findNearestDriver();
    await submitDriverForTrip(tripId, driverId);
    io.emit("submit-driver-for-trip", driverId);
    drivers_location = [];
    sendSMSForClient(tripId);
  });

  socket.on("disconnect", () => {
    console.info("user disconnected");
  });
});

const sendTripInfo = async () => {
  const trip_info = drivers_location[0].trip;
  const listDriverLocations = [];
  drivers_location.forEach((location) => {
    const lat = Number(location.lat);
    const lng = Number(location.lng);
    const distance = calcCrow(
      Number(trip_info.departure_lat),
      Number(trip_info.departure_lng),
      lat,
      lng
    );
    if (distance <= MAX_DISTANCE)
      listDriverLocations.push({ id: location.id, lat, lng, trip: trip_info });
  });
  if (listDriverLocations)
    io.emit("send-trip-info", JSON.stringify(listDriverLocations));

  timer = null;
  drivers_location = [];
};
const findNearestDriver = async () => {
  let max = 0;
  let driverId = null;
  const tripId = drivers_location[0].trip_id;
  const { departure_lat, departure_lng } = await Trip.findById(tripId);
  drivers_location.forEach((location) => {
    const lat = Number(location.driver.lat);
    const lng = Number(location.driver.lng);
    const distance = calcCrow(
      Number(departure_lat),
      Number(departure_lng),
      lat,
      lng
    );
    if (distance > max) {
      max = distance;
      driverId = location.driver.id;
    }
  });
  return driverId;
};

const sendSMSForClient = async (tripId) => {
  const trip = await Trip.findById(tripId).populate("driver_id");
  const name = trip.driver_id.name;
  const driverPhone = trip.driver_id.phone;
  const departure = trip.departure;
  // const clientPhone = trip.client_phone_number
  const clientPhone = "0343811945"
  const message = `\nChuyến đi bạn đặt đã được tài xế ${name} - ${driverPhone} nhận. Tài xế sẽ liên lạc với bạn khi tới điểm đón "${departure}"`;
  sendSMS(clientPhone, message);
};
