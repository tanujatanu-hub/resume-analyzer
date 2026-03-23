# ◈ ResumeAI – AI-Powered ATS Resume Analyzer

A complete, production-ready Resume Analyzer built with Node.js + Express + MongoDB backend and a beautiful dark-mode React dashboard.

## 🔗 Live Demo
Coming soon...

## ✨ Features

| Feature | Details |
|---------|---------|
| 🔐 User Authentication | JWT-based register/login, protected routes |
| 📄 Resume Upload | Supports PDF and DOCX formats (up to 10MB) |
| 🤖 ATS Score | Instant compatibility score out of 100 |
| 🔑 Keyword Matching | Compare resume against any job description |
| 💡 Smart Suggestions | Personalized tips to improve your resume |
| 📊 Score Dashboard | Track scores with bar charts and history |
| ✅ Section Detection | Checks for Experience, Education, Skills, etc. |
| 📞 Contact Info Check | Detects Email, Phone, LinkedIn, GitHub |

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router, Recharts, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Auth:** JWT + bcryptjs
- **Parsing:** pdf-parse, mammoth (DOCX)
- **Design:** Dark editorial theme, custom SVG gauge

## 📁 Project Structure
```
resume-analyzer/
├── client/                  ← React Frontend
│   ├── public/
│   └── src/
│       ├── api/             ← Axios instance
│       ├── components/      ← Navbar, ScoreGauge, ProtectedRoute
│       ├── context/         ← AuthContext (JWT)
│       └── pages/           ← Home, Login, Register, Dashboard, Upload, ResumeDetail
└── server/                  ← Node.js Backend
    ├── controllers/         ← authController, resumeController
    ├── middleware/          ← JWT auth middleware
    ├── models/              ← User, Resume schemas
    ├── routes/              ← auth, resume routes
    └── utils/               ← ATS scoring engine
```

## ⚡ Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (free)

### 2. Clone the Repository
```bash
git clone https://github.com/tanujatanu-hub/resume-analyzer.git
cd resume-analyzer
```

### 3. Setup Server
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

### 4. Setup Client
```bash
cd client
npm install
npm start
```

### 5. Open in Browser

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Main App |
| http://localhost:3000/register | Create Account |
| http://localhost:3000/upload | Analyze Resume |
| http://localhost:3000/dashboard | Score Dashboard |

## 🔌 API Reference

All resume endpoints require `Authorization: Bearer <token>`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Create account |
| POST | /api/auth/login | ❌ | Login, get JWT |
| GET | /api/auth/me | ✅ | Get current user |
| POST | /api/resume/upload | ✅ | Upload & analyze resume |
| GET | /api/resume | ✅ | Get all resumes |
| GET | /api/resume/:id | ✅ | Get single resume |
| PUT | /api/resume/:id/analyze | ✅ | Re-analyze with new JD |
| DELETE | /api/resume/:id | ✅ | Delete resume |

## 📊 ATS Scoring Breakdown

| Category | Points |
|----------|--------|
| Contact Information | 15 pts |
| Resume Sections | 25 pts |
| Technical Skills | 15 pts |
| Word Count | 10 pts |
| Readability | 5 pts |
| Job Description Match | 30 pts |
| **Total** | **100 pts** |

## 📸 Screenshots

### Dashboard
- ATS Score Gauge (0-100)
- Score History Bar Chart
- Resume Analysis Cards

### Analysis Page
- Radar Chart (Contact, Sections, Skills, Keywords, Readability)
- Keywords Found vs Missing
- Improvement Suggestions
- Re-analyze with new Job Description

## 👤 Author

**Tanuja** – Full Stack Web Development

Built as a real-world AI Resume Analyzer demonstrating:
- RESTful API design
- JWT authentication
- MongoDB data modeling
- AI-powered ATS scoring engine
- Premium React frontend design