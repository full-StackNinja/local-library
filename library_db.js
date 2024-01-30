const mongoose = require("mongoose");
require("dotenv").config();
(async function () {
  await mongoose.connect(process.env.MONGODB_URI);
})();

module.exports = mongoose;
