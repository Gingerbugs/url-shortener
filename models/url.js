const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const URLSchema = new Schema({
  url: String,
  short_url: String
});

/*URLSchema.virtual("short_url").get(function () {
  return this._id.toString().slice(-6);
});*/

module.exports = mongoose.model("Url", URLSchema);
