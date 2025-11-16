// Hardcoded Admin
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

// Hardcoded Employees
const employees = {
  "UTP223": {name: "Shreya", department: "HRD", password: "12345"},
  "EMP001": { name: "John Doe", department: "IT", password: "12345" },
  "EMP002": { name: "Priya Sharma", department: "HR", password: "12345" },
  "EMP003": { name: "Ravi Kumar", department: "Finance", password: "12345" }
};

// Utility: Save and Get Records
function saveRecord(record) {
  const records = JSON.parse(localStorage.getItem("records")) || [];
  records.push(record);
  localStorage.setItem("records", JSON.stringify(records));
}

function getRecords() {
  return JSON.parse(localStorage.getItem("records")) || [];
}

// Toggle status: Inside/Outside
function toggleStatus(empId) {
  const records = getRecords();
  const today = new Date().toLocaleDateString();
  const todaysRecords = records.filter(r => r.id === empId && new Date(r.time).toLocaleDateString() === today);

  if (todaysRecords.length >= 2) return "Limit Reached";
  const last = todaysRecords[todaysRecords.length - 1];
  return (!last || last.status === "Outside Premises") ? "Inside Premises" : "Outside Premises";
}

// Handle Employee Login
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const empDetailsDiv = document.getElementById("employee-details");
  const adminLogin = document.getElementById("admin-login");
  const recordsTable = document.getElementById("recordsTable");

  // Employee Login Page
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const empId = document.getElementById("empId").value.trim();
      const empPass = document.getElementById("empPass").value.trim();
      const msg = document.getElementById("msg");

      if (employees[empId] && employees[empId].password === empPass) {
        localStorage.setItem("currentEmployeeId", empId);
        window.location.href = "employee.html";
      } else {
        msg.textContent = "Invalid Employee ID or Password!";
        msg.style.color = "red";
      }
    });
  }

  // Employee Details Page
  if (empDetailsDiv) {
    const empId = localStorage.getItem("currentEmployeeId");
    const emp = employees[empId];
 
    if (!emp) {
      empDetailsDiv.innerHTML = `<p style='color:red;'>Invalid Employee!</p>`;
      return;
    }

    const time = new Date().toLocaleString();
    const status = toggleStatus(empId);

    if (status === "Limit Reached") {
      empDetailsDiv.innerHTML = `<p style="color:red;">You have already marked 2 entries today.</p>`;
      return;
    }

    const record = { id: empId, name: emp.name, dept: emp.department, time, status };
    saveRecord(record);

    empDetailsDiv.innerHTML = `
      <h3>${emp.name}</h3>
      <p><b>ID:</b> ${empId}</p>
      <p><b>Department:</b> ${emp.department}</p>
      <p><b>Time:</b> ${time}</p>
      <p><b>Status:</b> ${status}</p>
    `;
  }

  // Admin Login
  if (adminLogin) {
    adminLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = document.getElementById("username").value;
      const pass = document.getElementById("password").value;
      const msg = document.getElementById("login-msg");

      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        window.location.href = "records.html";
      } else {
        msg.textContent = "Invalid credentials!";
        msg.style.color = "red";
      }
    });
  }

  // Records Page
  if (recordsTable) {
    const tbody = recordsTable.querySelector("tbody");
    const records = getRecords();

    tbody.innerHTML = ""; // clear previous

    records.forEach(r => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${r.id}</td>
        <td>${r.name}</td>
        <td>${r.dept}</td>
        <td>${r.time}</td>
        <td>${r.status}</td>
      `;
      tbody.appendChild(row);
    });

    document.getElementById("downloadBtn").addEventListener("click", () => {
      if (records.length === 0) return alert("No records found!");
      const csv = [
        ["Employee ID", "Name", "Department", "Time", "Status"],
        ...records.map(r => [r.id, r.name, r.dept, r.time, r.status])
      ].map(e => e.join(",")).join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "employee_records.csv";
      link.click();
    });
}

  }
);
