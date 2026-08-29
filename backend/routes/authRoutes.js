const express = require("express");
const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/auth");
require('dotenv').config();

const router = express.Router();

router.post("/login", async (req, res) => {
  const { employeeId, password } = req.body;
  const employee = await Employee.findOne({employeeId});

  if (!employee) {
    return res.status(401).json({
      success: false,
      message: "Employee not found"
    });
  }

  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Wrong password"
    });
  }
const token = await jwt.sign({
  employeeId: employee.employeeId}, process.env.JWT_SECRET, {expiresIn: "1hr"});
  res.json({
    success: true,
    token,
    employee
  });
});

module.exports = router;