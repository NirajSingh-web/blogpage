const mongoose = require("mongoose");
const config = require("./../envConfiq");
const db_Connection = async () => {
  try {
    const dbconnection = await mongoose.connect(config.mongodb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });
    return dbconnection;
  } catch (e) {
    console.log("database disconnected");
  }
};
module.exports = db_Connection;
