function startLoading() {
  const bar = document.getElementById("progressBar");
  if (!bar) return;
  bar.style.width = "30%";
  setTimeout(() => {
    bar.style.width = "70%";
  }, 300);
}
function stopLoading() {
  const bar = document.getElementById("progressBar");
  if (!bar) return;
  bar.style.width = "100%";
  setTimeout(() => {
    bar.style.width = "0%";
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {

  const API_URL = "https://employee-entry-backend.onrender.com";

  const loginForm = document.getElementById("loginForm");
  const adminLogin = document.getElementById("admin-login");
  const empDetailsDiv = document.getElementById("employee-details");
  const recordsTable = document.getElementById("recordsTable");


  // Employee Login

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      startLoading();

      const employeeId = document.getElementById("empId").value.trim();
      const password = document.getElementById("empPass").value.trim();
      const msg = document.getElementById("msg");
      const btn = loginForm.querySelector("button");

      btn.disabled = true;
      btn.innerHTML = "⏳ Logging in...";

      try {
        const response = await fetch(
          `${API_URL}/api/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              employeeId,
              password
            })
          }
        );

        const data = await response.json();

        if (data.success) {
          localStorage.setItem("token",data.token);
          localStorage.setItem("employee", JSON.stringify(data.employee));
          stopLoading();
          setTimeout(() => {
            window.location.href = "employee.html";
          }, 300);

        } else {
          stopLoading();
          msg.textContent = data.message;
          msg.style.color = "red";
          btn.disabled = false;
          btn.innerHTML = "Login";
        }
      } catch (error) {
        console.error("Login error:", error);
        stopLoading();
        msg.textContent = "Server not running";
        msg.style.color = "red";
        btn.disabled = false;
        btn.innerHTML = "Login";
      }
    });
  }

  // Employee Page
  if (empDetailsDiv) {
    const emp = JSON.parse(localStorage.getItem("employee"));
    const token = localStorage.getItem("token");
    if (!emp || !token) {
      empDetailsDiv.innerHTML = "<p style='color:red'>Please Login First</p>";
      return;
    }

    const time = new Date().toLocaleString();

    empDetailsDiv.innerHTML = `<h3>${emp.name}</h3>
      <p>
        <b>ID:</b> ${emp.employeeId}
      </p>
      <p>
        <b>Department:</b> ${emp.department}
      </p>
      <p>
        <b>Time:</b> ${time}
      </p>
    `;

    const submitBtn = document.getElementById("submitEntryBtn");

    if (submitBtn) {
      submitBtn.addEventListener("click", async () => {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "⏳ Submitting...";
        const currentToken = localStorage.getItem("token");

        try {

          const response = await fetch(
            `${API_URL}/api/records`,
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${currentToken}`
              },

              body: JSON.stringify({
                employeeId: emp.employeeId,
                name: emp.name,
                department: emp.department
              })
            }
          );

          const data = await response.json();
          const entryMsg = document.getElementById("entryMsg");

          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("employee");
            entryMsg.textContent = "Session expired. Please login again.";
            entryMsg.style.color = "red";
            setTimeout(() => {
              window.location.href = "index.html";
            }, 1000);

            return;
          }

          if (data.success) {
            entryMsg.textContent = `Entry Recorded: ${data.record.status}`;
            entryMsg.style.color = "green";
            submitBtn.innerHTML = "✓ Submitted";
          } else {
            entryMsg.textContent = data.message;
            entryMsg.style.color = "red";
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Submit Entry";
          }

        } catch (error) {
          console.error( "Entry submission error:",error);
          alert("Unable to save record");
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Submit Entry";
        }
      });
    }
  }
  // Admin Login
  if (adminLogin) {
    adminLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      startLoading();
      const username = document.getElementById("username").value;

      const password = document.getElementById("password").value;

      const msg = document.getElementById("login-msg");

      if( username === "admin" && password === "1234") {
        stopLoading();
        window.location.href = "records.html";
      } else {
        stopLoading();
        msg.textContent = "Invalid Credentials";
        msg.style.color = "red";
      }
    });
  }
  // Records Page

  if (recordsTable) {
    const tbody =  recordsTable.querySelector("tbody");
    loadRecords();
    async function loadRecords() {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">Loading...</td>
        </tr>
      `;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          tbody.innerHTML = `
            <tr>
              <td colspan="5">
                Please Login First
              </td>
            </tr>
          `;
          return;
        }

        const response = await fetch(`${API_URL}/api/records`,{
            method: "GET",
            headers: { "Authorization": `Bearer ${token}`}
          }
        );

        const data = await response.json();

        if (response.status === 401) {

          localStorage.removeItem("token");
          localStorage.removeItem("employee");

          tbody.innerHTML = `
            <tr>
              <td colspan="5">
                Authentication failed. Please login again.
              </td>
            </tr>
          `;

          return;
        }

        if (!response.ok) {
          tbody.innerHTML = `
            <tr>
              <td colspan="5">
                ${data.message || "Unable to load records"}
              </td>
            </tr>
          `;
          return;
        }
        const records = data;
        tbody.innerHTML = "";
        records.forEach(record => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${record.employeeId}</td>
            <td>${record.name}</td>
            <td>${record.department}</td>
            <td>${record.time}</td>
            <td>${record.status}</td>
          `;
          tbody.appendChild(row);
        });

        const downloadBtn = document.getElementById("downloadBtn");

        if (downloadBtn) {
          downloadBtn.addEventListener("click",() => {
              const csv = [
                [
                  "Employee ID",
                  "Name",
                  "Department",
                  "Time",
                  "Status"
                ],

                ...records.map(record => [
                  record.employeeId,
                  record.name,
                  record.department,
                  record.time,
                  record.status
                ])
                ] .map(row => row.join(","))
                .join("\n");

              const blob = new Blob( [csv], {type: "text/csv"} );

              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = "employee_records.csv";
              link.click();
            }
          );

        }

      } catch (error) {
        console.error("Records error:",error);

        tbody.innerHTML = `<tr>
            <td colspan="5">
              Unable to load records
            </td>
          </tr>
        `;
      }
    }
  }

});
