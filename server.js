const App = require("express")();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const SeatsModel = require("./model/Seats");
const BusModel = require("./model/Bus");
const cors = require("cors");
const config = require("./config");
const serverRoute = require("./routes");
const defaultSeats = require("./default_seats.json");
mongoose.connect(config.url.concat(config.dbName), config.options);

App.use(bodyParser.json());
// Handle cors issue here..
App.use(cors({ origin: true }));
// Api routes goes here ...
App.use(serverRoute);

// initialize Server here...
App.listen(config.PORT, async () => {
  console.log(`Server started on Port:${config.PORT}`);
  let Bus = await require("./model/Bus");
  let defaultBus = await require("./default_bus.json");
  let buses = await Bus.find().catch(err => {
    //console.log(err);
    console.error("mongodb could not connect localhost");
    console.error("Server got terminated, Try again by re-starting server");
    process.exit();
  });
  if (buses.length == 0) {
    // create default bus bus in db
    new Bus(defaultBus).save(function(err, docs) {
      if (err) {
        console.log("NOTE:No Bus Could be created");
        console.log("This is because Mongo DB");
        console.log("------------------------------");
        console.log("       Re-start server         ");
        process.exit();
      }
      console.log("Thanks!! Bus with name: TNQ005 created !!");
      console.log("Make sure it is availabe in DB");
      AddSeats(defaultSeats, docs._id);
      // saved!
    });
  } else {
    console.log(`Use following bus name for further bookings`);
    console.log(`Bus Name:${buses[0].BusName}`);
  }
});

function AddSeats(Seats, BusId) {
  let recordArray = Seats.map(seatName => {
    return { Bus: BusId, SeatName: seatName };
  });
  SeatsModel.insertMany(recordArray)
    .then(SeatsCreatd => {
      console.log(`Seats created succsefully`);
    })
    .catch(err => {
      BusModel.deleteMany().then(deleted => {
        console.log(`Somthing with wrong mongo db kindly restart server`);
      });
    });
}
