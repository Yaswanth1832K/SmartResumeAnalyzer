# 🟢 LIVE DEMO: [smart-resume-analyzer-alpha.vercel.app](https://smart-resume-analyzer-alpha.vercel.app)

# Smart Resume Analyzer | AI ATS Optimizer

A high-performance, full-stack application that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS).

## 🚀 Features
- **Hybrid Matching Algorithm**: Combines Skill Matching (70%) and Semantic Analysis (30%) for accurate scoring.
- **AI-Powered Suggestions**: Provides structured feedback (Critical, Warning, Success) and actionable learning paths for missing skills.
- **Premium UI**: Glassmorphism design with smooth animations and responsive layout.
- **Privacy First**: Files are processed in memory and not permanently stored.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS v4, Framer Motion
- **Backend**: Python, Flask, NLTK, Scikit-Learn (TF-IDF)
- **Deployment**: Localhost (Port 5173 & 5000)

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/Yaswanth1832K/SmartResumeAnalyzer.git
   cd SmartResumeAnalyzer
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```


### Environment Variables
The backend automatically uses the `PORT` environment variable if available (for deployment platforms like Heroku/Render), otherwise defaults to `5000`.

## 🎯 Usage
1. **Start Application** (Windows)
   Double-click `start_app.bat` to launch both servers automatically.

2. **Manual Start**
2. Upload your Resume (PDF)
3. Paste the Job Description
4. Get instant analysis and improvement tips!

## 📄 License
MIT
