const mongoose = require("mongoose");

let SeatSchema = new mongoose.Schema({
  SeatName: { type: String, required: true },
  Bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
  createdDate: { type: Date, required: true, default: Date.now() },
  updatedDate: { type: Date, required: true, default: Date.now() }
});
module.exports = mongoose.model("Seat", SeatSchema);
