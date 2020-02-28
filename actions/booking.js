const Bookings = require("../model/Booking");
const BusAction = require("./bus");
const SeatModel = require("../model/Seats");

module.exports = {
  newBook: async data => {
    let response = { booked: false, message: "" };

    // check if on that date
    // seats are availble
    // fetch bus details
    // busName : because constant as we have considered
    let TNQBusDetails = await BusAction.getBusDetailsBYName("TNQ005");
    if (!TNQBusDetails) {
      response.message =
        "BUS TNQ005 Not found, Restart Server, if same issue  drop Db(xyz-buses) from monogo";
      return response;
    }
    let AllSeatsFromSeatTable = await SeatModel.find(
      { Bus: TNQBusDetails._id },
      { _id: 1 }
    );

    console.log(`All seats from  bus TNQ005 :`, AllSeatsFromSeatTable);
    let boardingDate = new Date(data.onWardDate.toString());
    let start = new Date(boardingDate.setHours(0, 0, 0, 0));
    let end = new Date(data.onWardDate.setHours(23, 59, 59));

    // check if seats availble
    // on selected date
    // if availble book
    let vacateSeat = null;
    for (let i = 0; i < AllSeatsFromSeatTable.length; await i++) {
      let totalBooking = await Bookings.countDocuments({
        onWardDate: { $gte: start, $lte: end },
        canceled: false,
        Seat: AllSeatsFromSeatTable[i]
      });
      let seatDetails = await SeatModel.findById(AllSeatsFromSeatTable[i]);
      if (totalBooking) {
        console.log(`Seat  Booked ${seatDetails.SeatName} `);
      } else {
        console.log(`Found Seat ${seatDetails.SeatName} `);
        vacateSeat = seatDetails;
        break;
      }
    }

    console.log(`Booking Seat ${vacateSeat}`);
    if (vacateSeat) {
      data["Seat"] = vacateSeat._id;
      let booking = await new Bookings(data);
      try {
        let docs = await booking.save();
        if (docs) {
          response.booked = true;
          response.message = {
            BookingId: docs._id,
            PassangerName: data.name,
            Status: "CNF",
            BusName: "TNQ005",
            SeatNumber: vacateSeat.SeatName,
            From: data.from,
            to: data.to,
            BoardingDate: new Date(data.onWardDate).toLocaleDateString(),
            Note: "Kindly Use your Booking Id , for Cancletation or Query"
          };
          return response;
        } else {
          response.booked = false;
          response.message = `Hi ${data.name}, Your ticket could not booked , try again `;
          return response;
        }
      } catch (err) {
        response.booked = false;
        response.message = `Hi ${data.name}, Your ticket could not booked , try again `;
        return response;
      }
    } else {
      response.booked = false;
      response.message = `Hi ${data.name}, No Seats Available on This Date`;
      return response;
    }
  },
  cancelBooking: async data => {
    let response = { cancled: false, message: "" };
    try {
      let totalBooking = await Bookings.updateOne(
        { _id: data },
        { canceled: true }
      );
      console.log("Query", totalBooking);
      if (totalBooking.nModified) {
        response.cancled = true;
        response.message = `Hi  your ticket got  canceled`;
        return response;
      } else {
        response.cancled = false;
        response.message = `Hi  Try again , BookingId not found`;
        return response;
      }
    } catch (err) {
      console.log("err", err);

      response.message = `Hi your ticket could not be   canceled, may be not found `;
      return response;
    }
  }
};
