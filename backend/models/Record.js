const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  department: String,
  status: String,
  time: String,
  dateKey: String
});

module.exports = mongoose.model("Record", recordSchema);