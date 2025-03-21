import { useState } from "react";
import Button from "../components/Button";
import ChatMessage from "./ChatMessage";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ChatBot = () => {
  const [conversation, setConversation] = useState([{ role: "bot", content: "Hi! What do you need? 🤖" }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setConversation((prev) => [...prev, userMessage]);
    setInput("");

    setIsLoading(true);
    try {
      const token = import.meta.env.VITE_HF_TOKEN;
      if (!token) {
        throw new Error("Token HuggingFace non trouvé dans les variables d'environnement");
      }

      console.log("Tentative de connexion à l'API HuggingFace...");
      const response = await fetch(
        "https://api-inference.huggingface.co/models/google/flan-t5-small",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: input,
            parameters: {
              max_length: 500,
              temperature: 0.8,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Réponse de l'API:", response.status, errorText);
        if (response.status === 401) {
          throw new Error("Token HuggingFace invalide. Veuillez vérifier votre token dans le fichier .env");
        }
        throw new Error(`Erreur API: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Réponse reçue:", data);
      
      const botMessage = { 
        role: "bot", 
        content: data[0].generated_text 
      };

      setConversation((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erreur détaillée:", error);
      const errorMessage = { 
        role: "bot", 
        content: "❌ Désolé, une erreur s'est produite. Veuillez vérifier la configuration de l'API." 
      };
      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 shadow-lg w-full max-w-md">
      <div className="space-y-4">
        <div className="h-66 overflow-y-auto bg-neutral-700 p-4 border-1 border-gray-500">
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
