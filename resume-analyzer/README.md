# ResumeAI — AI Resume Analyzer with ATS Scoring

## Tech Stack
- **Frontend:** React.js, React Router, Recharts, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (JSON Web Tokens)
- **Parsing:** pdf-parse, mammoth (DOCX)

---

## Project Structure
```
resume-analyzer/
├── client/                  ← React Frontend
│   ├── public/index.html
│   └── src/
│       ├── api/axios.js
│       ├── context/AuthContext.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── ScoreGauge.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Upload.jsx
│       │   └── ResumeDetail.jsx
│       ├── App.jsx
│       ├── App.css
│       └── index.js
└── server/                  ← Node.js Backend
    ├── controllers/
    │   ├── authController.js
    │   └── resumeController.js
    ├── middleware/auth.js
    ├── models/
    │   ├── User.js
    │   └── Resume.js
    ├── routes/
    │   ├── auth.js
    │   └── resume.js
    ├── utils/atsScorer.js
    ├── index.js
    └── .env.example
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongod`)

### 1. Setup Server
```bash
cd server
cp .env.example .env
npm install
npm run dev
# Server starts on http://localhost:5000
```

### 2. Setup Client (new terminal)
```bash
cd client
npm install
npm start
# App opens on http://localhost:3000
```

---

## Environment Variables (server/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/resume_analyzer
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
```

---

## Sample Test Data

**Register** a new account on `/register`

**Sample Job Description:**
> We are looking for a React and Node.js developer with experience in MongoDB, REST APIs, Docker, and AWS. The candidate should know JavaScript, TypeScript, Git, and CI/CD pipelines. Experience with Agile/Scrum is a plus.

**Upload** any PDF or DOCX resume → get instant ATS score + keyword analysis + suggestions.
