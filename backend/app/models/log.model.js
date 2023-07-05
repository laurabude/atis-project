const mongoose = require("mongoose");

const Log = mongoose.model(
  "Log",
  new mongoose.Schema({
    username: String,
    airport: String,
    log: String,
    language:String,
    date: Date
  })
);

module.exports = Log;
