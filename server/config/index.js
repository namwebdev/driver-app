const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useFindAndModify: true,
    });
    console.info(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit();
  }
};

module.exports = { connectDB };
