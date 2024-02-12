const mongoose = require("mongoose");
require("dotenv").config();
const library_db = async function () {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("Connected to the database")
}

module.exports = library_db;
