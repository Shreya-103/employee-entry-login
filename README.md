# Employee Entry Login System
<h5>Made during internship at BEL.</h5>
A full-stack employee attendance and record management system that allows employees to log in, mark attendance, and admin can view their records through a simple and user-friendly interface.

<a href="https://employee-entry-login.netlify.app"> Try it here </a>

## Features

### Employee Module

* Employee login using Employee ID
* Attendance entry and tracking
* View personal attendance records
* Responsive user interface

### Admin Module

* Access employee records
* Monitor attendance data
* Manage employee information

### Backend Features

* RESTful API architecture
* MongoDB database integration
* Secure data storage and retrieval
* Record management system

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla JS)

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Deployment

* Frontend: Netlify
* Backend: Render

## Project Structure

```text
employee-entry-login/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── config/
│
└── README.md
```

### Frontend Setup

Open the `frontend` folder and run the application using a local server or open `index.html` in your browser.

## API Configuration

Update the API URL inside `frontend/script.js` to point to your deployed backend:

```javascript
const API_URL = "https://your-render-backend-url.onrender.com";
```

## Deployment

### Frontend (Netlify)

* Base Directory: `frontend`
* Publish Directory: `.`
* Build Command: Leave empty

### Backend (Render)

* Root Directory: `backend`
* Build Command:

```bash
npm install
```

* Start Command:

```bash
npm start
```
## Author

Shreya

GitHub: https://github.com/Shreya-103
