const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  department: String,
  password: String
});

module.exports = mongoose.model("Employee",employeeSchema);