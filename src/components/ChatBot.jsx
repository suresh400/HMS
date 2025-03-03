import { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      const token = localStorage.getItem("token"); // Ensure authentication
      const response = await axios.post(
        "http://localhost:5000/api/v1/rag/ask",
        { question },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error fetching answer:", error);
      setAnswer("Failed to fetch an answer. Try again.");
    }
  };

  return (
    <div className="rag-chat-container">
      <h2>Ask a Question About Hospitals</h2>
      <input
        type="text"
        placeholder="Ask about hospital locations, specialities..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleAsk}>Ask</button>
      <p className="rag-answer">{answer}</p>
    </div>
  );
};

export default ChatBot;
