const express = require("express");
const router = express.Router();

const Record = require("../models/Record");

router.post("/", async (req, res) => {

  const record = await Record.create(
    req.body
  );

  res.json(record);
});

router.get("/", async (req, res) => {

  const records =
  await Record.find().sort({
      _id: -1
    });

  res.json(records);
});

module.exports = router;