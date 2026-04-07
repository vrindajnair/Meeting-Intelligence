"use client";
import { useState } from "react";


import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);


type ActionItem = {
  person: string;
  task: string;
  deadline: string;
};

type ResultType = {
  decisions: string[];
  action_items: ActionItem[];
};

type SentimentType = {
  sentiment: string;
  sentiment_score: number;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ResultType | null>(null);
  const [sentiment, setSentiment] = useState<SentimentType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      
      const res = await fetch("http://localhost:8000/extract/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Extract API failed");

      const data: ResultType = await res.json();
      setResult(data);

      
      const sentRes = await fetch("http://localhost:8000/sentiment/", {
        method: "POST",
        body: formData,
      });

      if (!sentRes.ok) throw new Error("Sentiment API failed");

      const sentData: SentimentType = await sentRes.json();
      setSentiment(sentData);

    } catch (err) {
      console.error("Error:", err);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  
  const getEmoji = () => {
    if (!sentiment) return "";
    if (sentiment.sentiment === "Positive") return "😄";
    if (sentiment.sentiment === "Negative") return "😡";
    return "😐";
  };

  
  const getColor = () => {
    if (!sentiment) return "text-gray-400";
    if (sentiment.sentiment === "Positive") return "text-green-400";
    if (sentiment.sentiment === "Negative") return "text-red-400";
    return "text-yellow-400";
  };

  
  const exportCSV = () => {
    if (!result) return;

    let csv = "Person,Task,Deadline\n";

    result.action_items.forEach((item) => {
      csv += `${item.person},${item.task},${item.deadline}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "action_items.csv";
    a.click();
  };

  
  const chartData = sentiment
    ? {
        labels: ["Positive", "Neutral", "Negative"],
        datasets: [
          {
            label: "Sentiment Score",
            data: [
              sentiment.sentiment === "Positive"
                ? sentiment.sentiment_score
                : 0,
              sentiment.sentiment === "Neutral"
                ? sentiment.sentiment_score
                : 0,
              sentiment.sentiment === "Negative"
                ? sentiment.sentiment_score
                : 0,
            ],
          },
        ],
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">
        Meeting Intelligence 🚀
      </h1>

      {/* Upload */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-xl mx-auto">
        <input
          type="file"
          accept=".txt,.vtt"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
          className="mb-4 w-full text-sm"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 rounded w-full"
        >
          Upload & Analyze
        </button>

        {loading && (
          <p className="mt-4 text-blue-300">Analyzing meeting...</p>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="mt-10 max-w-5xl mx-auto space-y-8">

          {/* Sentiment */}
          {sentiment && (
            <div className="bg-gray-800 p-6 rounded-xl shadow text-center">
              <h2 className="text-xl font-semibold mb-2">
                Meeting Sentiment
              </h2>
              <p className={`text-3xl font-bold ${getColor()}`}>
                {getEmoji()} {sentiment.sentiment}
              </p>
              <p className="text-sm text-gray-400">
                Score: {sentiment.sentiment_score.toFixed(2)}
              </p>
            </div>
          )}

          {/* Chart */}
          {chartData && (
            <div className="bg-gray-800 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">
                Sentiment Visualization
              </h2>
              <Bar data={chartData} />
            </div>
          )}

          {/* Decisions */}
          <div className="bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-3 text-blue-300">
              Decisions
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              {result.decisions.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>

          {/* Action Items */}
          <div className="bg-gray-800 p-6 rounded-xl shadow">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-300">
                Action Items
              </h2>
              <button
                onClick={exportCSV}
                className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
              >
                Export CSV
              </button>
            </div>

            <table className="w-full border border-gray-700">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-2 border border-gray-600">Person</th>
                  <th className="p-2 border border-gray-600">Task</th>
                  <th className="p-2 border border-gray-600">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {result.action_items.map((item, i) => (
                  <tr key={i} className="text-center">
                    <td className="p-2 border border-gray-600">{item.person}</td>
                    <td className="p-2 border border-gray-600">{item.task}</td>
                    <td className="p-2 border border-gray-600">{item.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
}
