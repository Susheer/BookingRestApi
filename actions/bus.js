const Bus = require("../model/Bus");
module.exports = {
  getBusDetailsBYName: async busName => {
    let bus = await Bus.findOne({ BusName: busName });
    if (bus) {
      return bus;
    } else {
      return null;
    }
  }
};
