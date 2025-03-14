import { useState } from "react";
import axios from "axios";
import Button from "../components/Button";

const ChatBot = () => {
    const [conversation, setConversation] = useState([{ role: "bot", content: "Hi! What do you need? 🤖" }]);
    const [input, setInput] = useState("");
    
    const callHuggingFaceAPI = async (message: string, history: string) => {
        const prompt = `You are a helpful and efficient assistant. Provide detailed and informative responses. 
        Conversation so far:
        ${history}
        User: ${message}
        Assistant:`;
      try {
        const response = await axios.post(
          "https://api-inference.huggingface.co/models/google/flan-t5-small",
          { inputs: prompt,
            parameters: {
                max_length: 512,
                temperature: 0.8,
                top_p: 0.9,
                repetition_penalty: 1.2,
            }
           },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data[0]?.generated_text || "🤖 Sorry, I didn't get that.";
      } catch (error: any) {
        console.error("Erreur API:", error);
        return "❌ Error when getting an answer.";
      }
    };
  
    const handleSend = async () => {
      if (!input.trim()) return;
      const userMessage = { role: "user", content: input };
      setConversation((prev) => [...prev, userMessage]);
      const conversationHistory = conversation
      .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n");
      setInput("");
  
      const botResponse = await callHuggingFaceAPI(input, conversationHistory);
      const botMessage = { role: "bot", content: botResponse };
      setConversation((prev) => [...prev, botMessage]);
    };
  
    return (
      <div className="p-4 shadow-lg w-full max-w-md">
        <div className="space-y-4">
          <div className="h-96 overflow-y-auto bg-neutral-700 p-4 border-1 border-gray-500">
            {conversation.map((msg, idx) => (
              <div key={idx} className={`p-2 ${msg.role === "user" ? "bg-yellow-100 text-black text-right" : "bg-neutral-600"}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              className="border p-2 flex-grow"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write here..."
            />
            <Button onClick={handleSend} className="ml-2">
              Envoyer
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ChatBot;