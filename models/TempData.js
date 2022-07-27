const mongoose = require("mongoose");

const TempDataSchema = mongoose.Schema(
  {
    pressure: { type: String },
    temp: { type: String },
    humidity: { type: String },
    date: { type: Number },
  },
  { collection: "tempData" }
);

module.exports = mongoose.model("TempData", TempDataSchema);
