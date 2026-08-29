const express = require("express");
const router = express.Router();
const Record = require("../models/Record");

// Create Record
router.post("/", async (req, res) => {
  try {
    const { employeeId, name, department } = req.body;
    const today = new Date().toISOString().split("T")[0];
    const todaysRecords = await Record.find({employeeId, dateKey: today}).sort({ _id: 1 });

    if (todaysRecords.length >= 2) {
      return res.status(400).json({
        success: false,
        message: "Only 2 entries allowed per day"
      });
    }

    const status = todaysRecords.length === 0 ? "Inside Premises" : "Outside Premises";

    const record = await Record.create({
      employeeId,
      name,
      department,
      status,
      time: new Date().toLocaleString(),
      dateKey: today
    });

    res.json({
      success: true,
      record
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

// Get Records
router.get("/", async (req, res) => {
  try {
    const records = await Record.find().sort({ _id: -1});
    res.json(records);

  } catch (error) {
    res.status(500).json({
      success: false
    });
  }
});

module.exports = router;