const express = require("express");
const router = express.Router();

const Employee = require("../models/Employee");

router.post("/login", async (req, res) => {

  const { employeeId, password } = req.body;

  const employee =
    await Employee.findOne({
      employeeId
    });

  if (!employee) {
    return res.status(401).json({
      success: false,
      message: "Employee not found"
    });
  }

  if (employee.password !== password) {
    return res.status(401).json({
      success: false,
      message: "Wrong password"
    });
  }

  res.json({
    success: true,
    employee
  });
});

module.exports = router;