const mongoose = require("mongoose");
require("dotenv").config();
(async function () {
  await mongoose.connect(process.env.DATABASE_URL);
})();

module.exports = mongoose;
