import { useState, useEffect, useRef } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import Button from "../components/Button";
import ChatMessage from "./ChatMessage";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const chatModel = new ChatOpenAI({
  openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  temperature: 0.8,
});

/** 🔹 Fonction pour récupérer la session depuis le backend */
const getSessionId = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/conversation/session`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to get session ID");

    const data = await response.json();
    return data.sessionId;
  } catch (error) {
    console.error("Error fetching session ID:", error);
    return null;
  }
};

/** 🔹 Récupérer l'historique des messages */
const getMessages = async (sessionId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/conversation/${sessionId}`, {
      method: "GET",
      credentials: "include", // ✅ Cookies envoyés
    });

    if (!response.ok) throw new Error("Failed to fetch messages");

    return await response.json();
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

/** 🔹 Sauvegarder un message */
const saveMessage = async (sessionId: string, role: string, content: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/conversation/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role, content }),
    });

    if (!response.ok) throw new Error("Failed to save message");

    return await response.json();
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

/** 🔹 Configuration du modèle LangChain */
const template = `You are a helpful AI assistant. Provide detailed and informative responses.
Conversation so far:
{history}
User: {input}
Assistant:`;

const prompt = PromptTemplate.fromTemplate(template);
const chain = RunnableSequence.from([prompt, chatModel]);

const ChatBot = () => {
  const [conversation, setConversation] = useState([{ role: "bot", content: "Hi! What do you need? 🤖" }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const initializeSession = async () => {
      const fetchedSessionId = await getSessionId();
      if (!fetchedSessionId) {
        console.error("❌ Impossible d'obtenir un sessionId !");
        return;
      }
  
      setSessionId(fetchedSessionId);
      const messages = await getMessages(fetchedSessionId);
      if (messages.length > 0) {
        setConversation(messages);
      }
    };
  
    initializeSession();
  }, [isAuthenticated, navigate]);
  

  /** 🔹 Envoi du message */
  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!input.trim()) return;
    if (!sessionId) {
      console.error("❌ Session ID non défini !");
      return;
    }

    const userMessage = { role: "user", content: input };
    setConversation((prev) => [...prev, userMessage]);
    await saveMessage(sessionId, userMessage.role, userMessage.content);
    setInput("");

    setIsLoading(true);
    try {
      const history = await getMessages(sessionId);
      const historyString = history.map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join("\n");
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await chain.invoke({ history: historyString, input });
      const botMessage = { role: "bot", content: response.content.toString() };

      setConversation((prev) => [...prev, botMessage]);
      await saveMessage(sessionId, botMessage.role, botMessage.content);
    } catch (error) {
      console.error("LangChain Error:", error);
      const errorMessage = { role: "bot", content: "❌ Error generating response." };
      setConversation((prev) => [...prev, errorMessage]);
      await saveMessage(sessionId, errorMessage.role, errorMessage.content);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 shadow-lg w-full max-w-md">
      <div className="space-y-4">
        <div ref={chatContainerRef} className="h-66 overflow-y-auto bg-neutral-700 p-4 border-1 border-gray-500">
          {conversation.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-center justify-center p-2">
              <div className="animate-spin h-6 w-6 border-2 border-white"></div>
            </div>
          )}
        </div>
        <div className="flex w-full">
          <form onSubmit={handleSend} className="w-full flex">
            <textarea
              className="border p-2 flex-grow w-full"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write here..."
            />
            <Button type="submit" className="ml-2">
              Envoyer
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
