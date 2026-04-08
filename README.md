# 🚀 Meeting Intelligence System

## 🧩 The Problem
Meetings often generate large amounts of unstructured text, making it difficult to identify key decisions, action items, and overall sentiment. Teams struggle to quickly extract meaningful insights and track responsibilities.

## 💡 The Solution
This project provides an AI-powered Meeting Intelligence System that processes meeting transcripts (.txt, .vtt) and automatically extracts:
- Key decisions made during the meeting
- Action items with assigned responsibilities
- Sentiment analysis of the meeting
- Visual insights using charts

It simplifies understanding and improves team productivity by turning raw text into structured insights.

## 🛠️ Tech Stack

### Languages
- Python
- TypeScript / JavaScript

### Frameworks
- FastAPI (Backend)
- Next.js (Frontend)
- Tailwind CSS

### Libraries & Tools
- TextBlob (Sentiment Analysis)
- Chart.js (Visualization)
- React Chart.js 2

### Other
- GitHub (Version Control)
- Vercel (Frontend Deployment)
- Render (Backend Deployment)

---

## ⚙️ Setup Instructions

### 🔹 Backend

```bash
cd backend
pip install -r requirements.txt
python -m textblob.download_corpora
uvicorn main:app --reload

🔹 Frontend
cd frontend
npm install
npm run dev

🎯 Features
	•	📂 Upload meeting transcripts (.txt, .vtt)
	•	🧠 Extract decisions and action items
	•	😊 Sentiment analysis with score
	•	📊 Sentiment visualization (charts)
	•	📄 Export action items as CSV
	•	🎨 Clean and responsive UI
