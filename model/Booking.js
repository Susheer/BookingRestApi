const mongoose = require("mongoose");
let bookingSchema = new mongoose.Schema({
  name: { type: String, require: true },
  from: { type: String, require: true },
  to: { type: String, require: true },
  onWardDate: { type: Date, require: true },
  canceled: { type: Boolean, default: false },
  Seat: { type: mongoose.Schema.Types.ObjectId, ref: "Seat" },
  createdDate: { type: Number, required: true, default: Date.now() },
  updatedDate: { type: Date, required: true, default: Date.now() }
});

module.exports = mongoose.model("Bookings", bookingSchema);
