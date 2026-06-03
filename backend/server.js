const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes =
  require("./routes/authRoutes");

const recordRoutes =
  require("./routes/recordRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
})
.catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server Running");
});