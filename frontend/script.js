document.addEventListener("DOMContentLoaded", () => {

  const API_URL = "http://localhost:5000";

  const loginForm = document.getElementById("loginForm");
  const adminLogin = document.getElementById("admin-login");
  const empDetailsDiv = document.getElementById("employee-details");
  const recordsTable = document.getElementById("recordsTable");

  // =========================
  // EMPLOYEE LOGIN
  // =========================

  if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

      e.preventDefault();

      const employeeId =
        document.getElementById("empId").value.trim();

      const password =
        document.getElementById("empPass").value.trim();

      const msg =
        document.getElementById("msg");

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

          localStorage.setItem(
            "employee",
            JSON.stringify(data.employee)
          );

          window.location.href =
            "employee.html";

        } else {

          msg.textContent =
            data.message;

          msg.style.color = "red";
        }

      } catch (error) {

        msg.textContent =
          "Server not running";

        msg.style.color = "red";
      }
    });
  }

  // =========================
  // EMPLOYEE ENTRY PAGE
  // =========================

  if (empDetailsDiv) {

    const emp = JSON.parse(
      localStorage.getItem("employee")
    );

    if (!emp) {

      empDetailsDiv.innerHTML =
        "<p style='color:red'>Please Login First</p>";

      return;
    }

    const time =
      new Date().toLocaleString();

    const status =
      "Inside Premises";

    empDetailsDiv.innerHTML = `
      <h3>${emp.name}</h3>

      <p>
        <b>ID:</b>
        ${emp.employeeId}
      </p>

      <p>
        <b>Department:</b>
        ${emp.department}
      </p>

      <p>
        <b>Time:</b>
        ${time}
      </p>

      <p>
        <b>Status:</b>
        ${status}
      </p>
    `;

    const submitBtn =
      document.getElementById(
        "submitEntryBtn"
      );

    submitBtn.addEventListener(
      "click",
      async () => {

        try {

          const response =
            await fetch(
              `${API_URL}/api/records`,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                  employeeId:
                    emp.employeeId,

                  name:
                    emp.name,

                  department:
                    emp.department,

                  status,

                  time,

                  dateKey:
                    new Date()
                      .toISOString()
                      .split("T")[0]
                })
              }
            );

          if (response.ok) {

            const entryMsg =
              document.getElementById(
                "entryMsg"
              );

            entryMsg.textContent =
              "Entry Recorded Successfully";

            entryMsg.style.color =
              "green";

            submitBtn.disabled =
              true;
          }

        } catch (error) {

          alert(
            "Unable to save record"
          );
        }
      }
    );
  }

  // =========================
  // ADMIN LOGIN
  // =========================

  if (adminLogin) {

    adminLogin.addEventListener(
      "submit",
      (e) => {

        e.preventDefault();

        const username =
          document.getElementById(
            "username"
          ).value;

        const password =
          document.getElementById(
            "password"
          ).value;

        const msg =
          document.getElementById(
            "login-msg"
          );

        if (
          username === "admin" &&
          password === "1234"
        ) {

          window.location.href =
            "records.html";

        } else {

          msg.textContent =
            "Invalid Credentials";

          msg.style.color =
            "red";
        }
      }
    );
  }

  // =========================
  // RECORDS PAGE
  // =========================

  if (recordsTable) {

    loadRecords();

    async function loadRecords() {

      const tbody =
        recordsTable.querySelector(
          "tbody"
        );

      tbody.innerHTML = "";

      try {

        const response =
          await fetch(
            `${API_URL}/api/records`
          );

        const records =
          await response.json();

        records.forEach(record => {

          const row =
            document.createElement(
              "tr"
            );

          row.innerHTML = `
            <td>${record.employeeId}</td>
            <td>${record.name}</td>
            <td>${record.department}</td>
            <td>${record.time}</td>
            <td>${record.status}</td>
          `;

          tbody.appendChild(row);
        });

        document
          .getElementById(
            "downloadBtn"
          )
          .addEventListener(
            "click",
            () => {

              const csv = [
                [
                  "Employee ID",
                  "Name",
                  "Department",
                  "Time",
                  "Status"
                ],

                ...records.map(r => [
                  r.employeeId,
                  r.name,
                  r.department,
                  r.time,
                  r.status
                ])
              ]
              .map(row =>
                row.join(",")
              )
              .join("\n");

              const blob =
                new Blob(
                  [csv],
                  {
                    type:
                      "text/csv"
                  }
                );

              const link =
                document.createElement(
                  "a"
                );

              link.href =
                URL.createObjectURL(
                  blob
                );

              link.download =
                "employee_records.csv";

              link.click();
            }
          );

      } catch (error) {

        console.error(error);
      }
    }
  }
});