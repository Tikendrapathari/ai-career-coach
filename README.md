# 🚀 AI Career Coach - Complete Interview Preparation Platform

An AI-powered full-stack application that helps students and professionals prepare for job interviews with mock interviews, resume analysis, coding practice, and personalized career guidance.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

## ✨ Features

### 🔐 Authentication
- User Registration & Login
- JWT Token Authentication
- Google OAuth Integration
- Password Reset via Email
- Protected Routes

### 📊 Dashboard
- Welcome section with user name
- Statistics cards (interviews, scores, roadmaps)
- Performance progress charts
- Skills distribution pie chart
- Recent activity feed
- Quick action buttons

### 📄 AI Resume Analyzer
- PDF resume upload
- Text extraction from PDF
- ATS Score calculation (0-100)
- Strengths & weaknesses analysis
- Missing keywords detection
- Skill gap analysis
- Improvement suggestions
- ATS-friendly resume generation

### 🎙️ AI Mock Interview
- Multiple interview types (HR, Technical, Behavioral, Company-specific)
- Voice recording for answers
- Speech-to-text conversion
- AI-powered question generation
- Answer evaluation with scoring
- Communication, Technical, Confidence scoring
- Facial expression analysis
- Interview history saving

### 💻 Coding Interview Module
- DSA problem generation (Easy/Medium/Hard)
- Multiple language support (JavaScript, Python, Java, C++)
- Monaco Code Editor with syntax highlighting
- AI hint system
- Code evaluation and scoring
- Time & space complexity analysis
- Test cases (hidden & visible)

### 🤖 AI Career Mentor (Chatbot)
- Real-time chat interface
- Groq API integration (Llama 3.3 70B)
- Conversation context memory
- Career guidance and advice
- Interview preparation tips
- Resume improvement suggestions
- Skill recommendations
- Chat history saving

### 🗺️ Personalized Roadmap Generator
- Dream job input
- Current skills assessment
- Timeline selection (3/6/12 months)
- Weekly learning plans
- Resource recommendations
- Portfolio project suggestions
- Progress tracking

### 🎯 Job Matching System
- Resume skill extraction
- AI-powered job recommendations
- Match score calculation
- Missing skills identification
- Learning resource suggestions
- Salary estimates

### 🏢 Company Specific Preparation
- 7+ companies supported (Google, Microsoft, Amazon, Infosys, TCS, Wipro, Accenture)
- Company-specific interview questions
- Preparation tips
- Mock interview integration

### 📈 AI Recruiter Report
- Resume score integration
- Communication score
- Technical score
- Confidence score
- Career readiness score (0-100)
- Recommendations & next steps
- PDF export functionality

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v18+ | JavaScript runtime |
| Express.js | 4.18.2 | Web framework |
| MongoDB | 8.0.0 | Database |
| JWT | 9.0.2 | Authentication |
| Groq API | Latest | AI/LLM integration |
| Socket.io | 4.5.4 | Real-time communication |
| Multer | 1.4.5 | File upload |
| bcryptjs | 2.4.3 | Password hashing |
| PDFKit | Latest | PDF generation |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.2.0 | UI library |
| Vite | 5.0.8 | Build tool |
| Tailwind CSS | 3.3.6 | Styling |
| Framer Motion | 10.16.16 | Animations |
| Recharts | 2.10.3 | Charts |
| Monaco Editor | 4.6.0 | Code editor |
| Axios | 1.6.2 | API calls |
| Socket.io-client | 4.5.4 | Real-time client |
| Lucide React | 0.303.0 | Icons |

## 📁 Project Structure
