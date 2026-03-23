 
echo # ResumeAI - AI Powered ATS Resume Analyzer > README.md
```

**Step 3 — Open README.md in VS Code** and replace everything with this content:
```
# ResumeAI – AI-Powered ATS Resume Analyzer

A full-stack web application that analyzes resumes and provides ATS compatibility scores with improvement suggestions.

## 🔗 Live Demo
Coming soon...

## 🚀 Features
- ✅ User Authentication (JWT)
- ✅ Resume Upload (PDF/DOCX)
- ✅ ATS Score Calculation (0-100)
- ✅ Keyword Matching with Job Description
- ✅ Improvement Suggestions
- ✅ Score Dashboard with Charts

## 🛠️ Tech Stack
- **Frontend:** React.js, React Router, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT (JSON Web Tokens)
- **Parsing:** pdf-parse, mammoth

## ⚙️ Setup Instructions

### 1. Clone the repository
git clone https://github.com/tanujatanu-hub/resume-analyzer.git
cd resume-analyzer

### 2. Setup Server
cd server
cp .env.example .env
npm install
npm run dev

### 3. Setup Client
cd client
npm install
npm start

## 📁 Project Structure
resume-analyzer/
├── client/          ← React Frontend
└── server/          ← Node.js Backend

## 👩‍💻 Developer
Made by Tanuja