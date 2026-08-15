# JobMate — AI-Based Job Recruitment Platform

JobMate is a full-stack job recruitment platform designed to connect candidates and recruiters through a simple, secure, and user-friendly web application.

Candidates can create profiles, upload resumes, search for jobs, and apply for suitable positions. Recruiters can create and manage job postings, review applicants, and update application statuses.

---

## 🚀 Features

### 👨‍💻 Candidate Features

* User registration and login
* JWT-based authentication
* Candidate dashboard
* Profile management
* Add skills, education, and experience
* Resume upload, view, and delete
* Browse available jobs
* Search jobs by:

  * Job title
  * Company
  * Location
  * Skills
* View detailed job information
* Apply for jobs
* Submit cover letters
* View submitted applications
* Track application status
* Logout functionality

### 🧑‍💼 Recruiter Features

* Recruiter registration and login
* Recruiter dashboard
* Create job postings
* Edit existing jobs
* Delete job postings
* View posted jobs
* View job applicants
* View candidate information
* View candidate resumes
* Review cover letters
* Update application status:

  * Pending
  * Shortlisted
  * Selected
  * Rejected

### 🔐 Security

* JWT authentication
* Protected routes
* Role-based authorization
* Candidate and recruiter access control
* Secure API communication

### 📱 UI & Responsive Design

* Professional dashboard interface
* Responsive job cards
* Responsive recruiter and candidate dashboards
* Mobile-friendly layouts
* Professional forms and buttons
* Loading and error states
* User-friendly success/error messages

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* JavaScript
* HTML5
* CSS3
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Multer

### Development Tools

* Visual Studio Code
* Git
* GitHub
* MongoDB Atlas
* Postman / Hoppscotch

---

## 📂 Project Structure

```text
JobMate/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/maheswarmaity/JobMate.git
```

Move into the project directory:

```bash
cd JobMate
```

---

## 🎨 Frontend Setup

Open the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## 🔧 Backend Setup

Open another terminal and navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

The backend API will normally run on:

```text
http://localhost:5000
```

---

## 🗄️ Database

JobMate uses **MongoDB** for storing:

* User information
* Job information
* Applications
* Candidate profiles
* Resume information

MongoDB Atlas can be used as the cloud database.

---

## 🔑 Authentication Flow

JobMate uses JWT-based authentication.

### Candidate

```text
Register
   ↓
Login
   ↓
JWT Token
   ↓
Candidate Dashboard
   ↓
Browse Jobs
   ↓
Apply
   ↓
Track Application
```

### Recruiter

```text
Register
   ↓
Login
   ↓
JWT Token
   ↓
Recruiter Dashboard
   ↓
Create Job
   ↓
View Applicants
   ↓
Update Application Status
```

---

## 📌 Main Routes

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Jobs

```text
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id
```

### Applications

```text
POST /api/applications
GET  /api/applications/my
GET  /api/applications/job/:jobId/applicants
PUT  /api/applications/:applicationId/status
```

### Profile

```text
GET /api/users/profile
PUT /api/users/profile
```

### Resume

```text
GET    /api/resume
POST   /api/resume/upload
DELETE /api/resume
```

### Dashboards

```text
GET /api/dashboard/candidate
GET /api/dashboard/recruiter
```

---

## 👤 User Roles

JobMate supports two primary user roles.

| Role      | Capabilities                                                                    |
| --------- | ------------------------------------------------------------------------------- |
| Candidate | Search jobs, apply, manage profile, upload resume, track applications           |
| Recruiter | Create jobs, edit jobs, delete jobs, view applicants, manage application status |

---

## 📸 Screenshots

Add project screenshots here after taking screenshots of your application.

### Login

```text
Add login page screenshot here
```

### Candidate Dashboard

```text
Add candidate dashboard screenshot here
```

### Job Listing

```text
Add job listing screenshot here
```

### Job Details

```text
Add job details screenshot here
```

### Recruiter Dashboard

```text
Add recruiter dashboard screenshot here
```

### Applicants Management

```text
Add applicants page screenshot here
```

---

## 🔮 Future Improvements

The project can be extended with:

* AI-powered resume screening
* Resume-to-job matching
* Job recommendation system
* Advanced job filtering
* Email notifications
* Recruiter analytics
* Candidate skill matching
* Online interview scheduling
* Application timeline
* Admin dashboard
* Cloud-based resume storage
* Production deployment

---

## 🧪 Testing

Before deployment, test the following:

* Registration
* Login
* Logout
* Protected routes
* Role-based access
* Job creation
* Job editing
* Job deletion
* Job search
* Job application
* Resume upload
* Resume deletion
* Application status updates
* Mobile responsiveness

---

## 🌐 Deployment

The application can be deployed using services such as:

### Frontend

* Vercel
* Netlify

### Backend

* Render
* Railway

### Database

* MongoDB Atlas

---

## 👨‍💻 Author

**Maheswar Maity**

B.Tech — Computer Science & Engineering

GitHub:
https://github.com/maheswarmaity

---

## 📄 License

This project was developed as part of an **IBM Industrial Training Program** for educational and academic purposes.

The project is intended for learning, training, and demonstration purposes.





