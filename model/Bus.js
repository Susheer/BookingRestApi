const mongoose = require("mongoose");
// we have only one bus
// As u run server
// One bus will be added auto
// If want add more
// Api not availble
let BusSchema = new mongoose.Schema({
  BusName: { type: String, required: true },
  createdDate: { type: Date, required: true, default: Date.now() },
  updatedDate: { type: Date, required: true, default: Date.now() }
});
module.exports = mongoose.model("Bus", BusSchema);
