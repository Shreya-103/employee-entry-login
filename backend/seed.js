const mongoose = require("mongoose");

const Employee =
require("./models/Employee");

mongoose.connect(
"mongodb+srv://plagiarism108_db_user:Shreya103@cluster0.xugjre9.mongodb.net/?appName=Cluster0"
);

Employee.insertMany([
{
employeeId:"UPT223",
name:"Shreya",
department:"HRD",
password:"12345"
},
{
employeeId:"EMP001",
name:"John Doe",
department:"IT",
password:"12345"
},
{
employeeId:"EMP002",
name:"Priya Sharma",
department:"HR",
password:"12345"
},
{
employeeId:"EMP003",
name:"Ravi Kumar",
department:"Finance",
password:"12345"
}
]).then(()=>{
console.log("Employees Added");
process.exit();
});