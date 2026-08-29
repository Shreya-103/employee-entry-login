const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Employee = require("./models/Employee");

async function seedEmployees() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const hashedPassword = await bcrypt.hash(process.env.EMP_PASSWORD, 10);

        await Employee.insertMany([
            {
                employeeId: "UPT223",
                name: "Shreya",
                department: "HRD",
                password: hashedPassword
            },
            {
                employeeId: "EMP001",
                name: "Shree",
                department: "IT",
                password: hashedPassword
            },
            {
                employeeId: "EMP002",
                name: "Surbhi",
                department: "HR",
                password: hashedPassword
            },
            {
                employeeId: "EMP003",
                name: "Kirti",
                department: "Finance",
                password: hashedPassword
            }
        ]);

        console.log("Employees Added");

        await mongoose.connection.close();
    } catch (error) {
        console.error("Seeding failed:", error);
    }
}

seedEmployees();