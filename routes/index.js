const express = require("express");
const booking = express.Router();
// controller
const bookingCtl = require("../controller/bookingController");

// Api Endpoits
booking.get("/busSeatDetails", bookingCtl.busSeatDetails);
booking.post("/bookSeat", bookingCtl.bookSeat);
booking.delete("/cancelBookedSeat", bookingCtl.cancelBookedSeat);
booking.get("/bookedSeatDetails/:bookingId", bookingCtl.bookedSeatDetails);

module.exports = booking;
