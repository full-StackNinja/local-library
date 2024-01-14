const mongoose = require("mongoose");

const { Schema } = mongoose;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Define virtual property

AuthorSchema.virtual("name").get(function () {
  let name = "";
  if (this.first_name && this.family_name) {
    const name = `${this.family_name}, ${this.first_name}`;
  }
  return name;
});

AuthorSchema.virtual("url").get(function () {
  return `/catalog/author/${this._id}`;
});

module.exports = mongoose.model("Author", AuthorSchema);
