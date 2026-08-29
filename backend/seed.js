const mongoose = require("mongoose");

require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require("./models/Employee");
const bcrypt = require("bcrypt.js");

const hashedPassword = await bcrypt.hash("12345", 10);

mongoose.connect(process.env.MONGO_URI);
Employee.insertMany([
{
employeeId:"UPT223",
name:"Shreya",
department:"HRD",
password:hashedPassword
},
{
employeeId:"EMP001",
name:"Shree",
department:"IT",
password: hashedPassword
},
{
employeeId:"EMP002",
name:"Surbhi",
department:"HR",
password:hashedPassword
},
{
employeeId:"EMP003",
name:"kirti",
department:"Finance",
password:hashedPassword
}
]).then(()=>{
console.log("Employees Added");
process.exit();
});