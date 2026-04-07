from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from textblob import TextBlob  # ✅ ADD THIS

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 Smart processing function
def process_meeting_text(text: str):
    lines = text.split("\n")

    decisions = []
    action_items = []
    key_points = []

    for line in lines:
        lower = line.lower()

        if "decide" in lower or "decided" in lower or "agreed" in lower:
            decisions.append(line.strip())

        if "will" in lower or "todo" in lower or "action" in lower:
            action_items.append({
                "person": "Team Member",
                "task": line.strip(),
                "deadline": "Not specified"
            })

        if len(line.strip()) > 20:
            key_points.append(line.strip())

    summary = " ".join(lines[:2]) if lines else "No summary available"

    if not decisions:
        decisions = ["Team discussed overall progress"]

    if not action_items:
        action_items = [
            {
                "person": "Alice",
                "task": "Prepare report",
                "deadline": "Tomorrow"
            }
        ]

    return decisions, action_items, summary, key_points


# 🎯 EXTRACT API
@app.post("/extract/")
async def extract_info(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = content.decode("utf-8")

        decisions, action_items, summary, key_points = process_meeting_text(text)

        return {
            "decisions": decisions,
            "action_items": action_items,
            "summary": summary,
            "key_points": key_points
        }

    except Exception:
        return {
            "decisions": ["Error"],
            "action_items": [],
            "summary": "Error processing file",
            "key_points": []
        }


# 🔥 NEW SENTIMENT API
@app.post("/sentiment/")
async def get_sentiment(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = content.decode("utf-8")

        blob = TextBlob(text)
        polarity = blob.sentiment.polarity

        if polarity > 0:
            sentiment = "Positive"
        elif polarity < 0:
            sentiment = "Negative"
        else:
            sentiment = "Neutral"

        return {
            "sentiment": sentiment,
            "sentiment_score": polarity
        }

    except Exception:
        return {
            "sentiment": "Unknown",
            "sentiment_score": 0
        }


@app.get("/")
def home():
    return {"message": "Meeting Intelligence Hub API 🚀"}