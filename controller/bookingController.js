const bookingActions = require("../actions/booking");
const validator = require("validator");
const SeatModel = require("../model/Seats");
const BusAction = require("../actions/bus");
const Bookings = require("../model/Booking");
const moment = require("moment");
module.exports = {
  busSeatDetails: async (req, res) => {
    // populate seats from seats table
    // by bus _id
    // BusName: TNQ005
    let bus = await BusAction.getBusDetailsBYName("TNQ005");
    let response_blueprint = {
      BusName: bus.BusName,
      Seats: [],
      TotalSeats: 0
    };
    let seatDetails = await SeatModel.find({ Bus: bus._id }).populate("Bus");
    let seats = seatDetails.map(seat => {
      return { SeatNumber: seat.SeatName, id: seat._id };
    });
    response_blueprint.Seats = seats;
    response_blueprint.TotalSeats = seats.length;

    return res.status(200).send(response_blueprint);
  },
  bookSeat: async (req, res) => {
    // error checking
    //#1
    //if all Required  keys are available in req body
    if (
      !("name" in req.body) ||
      !("from" in req.body) ||
      !("to" in req.body) ||
      !("onWardDate" in req.body)
    ) {
      return res
        .status(400)
        .send("Missing required params['name', 'from','to','onWardDate'] ");
    }

    // error checking
    //#2
    //Null or blank
    if (!req.body.name || !validator.isAlpha(req.body.name)) {
      return res.status(400).send("Name contains only letters (a-zA-Z)");
    }
    if (!req.body.from || !validator.isAlphanumeric(req.body.from)) {
      return res.status(400).send("from contains  only letters and numbers");
    }
    if (!req.body.to || !validator.isAlphanumeric(req.body.to)) {
      return res.status(400).send("to contains  only letters and numbers");
    }
    if (!req.body.onWardDate || !validator.isAfter(req.body.onWardDate)) {
      return res
        .status(400)
        .send(
          "'onWardDate', Booking not possible in previous date [dd/mm/yyyy] "
        );
    }

    // error checking
    //#3
    // validate dates
    let onWrdsDate = null;
    try {
      onWrdsDate = new Date(req.body.onWardDate);
    } catch (err) {
      return res
        .status(400)
        .send(
          "Somthing wrong with  'onWardDate' expected fromat [dd/mm/yyyy] "
        );
    }

    let new_booking_data = {
      name: req.body.name,
      from: req.body.from,
      to: req.body.to,
      onWardDate: onWrdsDate
    };
    let created = await bookingActions.newBook(new_booking_data);
    return res.send(created);
  },
  cancelBookedSeat: async (req, res) => {
    if (!req.body.bookingId) {
      return res.status(400).send("bookingId must not be null");
    }

    let cancled = await bookingActions.cancelBooking(req.body.bookingId);
    return res.send(cancled);
  },
  bookedSeatDetails: async (req, res) => {
    let bookingId = req.params.bookingId;
    console.log("Booking id", bookingId);
    let bus = await BusAction.getBusDetailsBYName("TNQ005");
    let bookingDetsil = await Bookings.findById(bookingId).populate("Seat");

    let response_blueprint = {
      PassangerName: bookingDetsil.name,
      BookingStatus: bookingDetsil.canceled ? "CANCELED" : "CNF",
      BusName: bus.BusName,
      Seat: bookingDetsil.Seat.SeatName,
      boardingDate: new Date(bookingDetsil.onWardDate).toLocaleDateString(),
      from: bookingDetsil.from,
      to: bookingDetsil.to
    };

    return res.status(200).send(response_blueprint);
  }
};
