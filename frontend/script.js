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

  //employee login
  if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {
      startLoading();
      e.preventDefault();

      const employeeId =
        document.getElementById("empId").value.trim();

      const password =
        document.getElementById("empPass").value.trim();

      const msg =
        document.getElementById("msg");
      const btn =
        loginForm.querySelector("button");

      btn.disabled = true;
      btn.innerHTML =
        "⏳ Logging in...";
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
          stopLoading();
          setTimeout(() => {
            window.location.href = "employee.html";
          }, 300);
          // window.location.href =
          //   "employee.html";
          btn.disabled = false;
          btn.innerHTML = "Login";

        } else {
          stopLoading();
          msg.textContent =
            data.message;
          btn.disabled = false;
          btn.innerHTML = "Login";
          msg.style.color = "red";
        }

      } catch (error) {

        msg.textContent =
          "Server not running";

        msg.style.color = "red";
      }
    });
  }

  // EMPLOYEE ENTRY PAGE
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

  // ADMIN LOGIN
  if (adminLogin) {
    adminLogin.addEventListener(
      "submit",
      (e) => {
        startLoading();
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
          stopLoading();
          window.location.href =
            "records.html";

        } else {
          stopLoading();
          msg.textContent =
            "Invalid Credentials";

          msg.style.color =
            "red";
        }
      }
    );
  }

  // RECORDS PAGE
  if (recordsTable) {
    loadRecords();
    async function loadRecords() {
      tbody.innerHTML = `
<tr>
<td>...</td>
<td>...</td>
<td>...</td>
<td>...</td>
<td>...</td>
</tr>
<tr>
<td>...</td>
<td>...</td>
<td>...</td>
<td>...</td>
<td>...</td>
</tr>
`;

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