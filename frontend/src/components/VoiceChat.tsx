import React, { useState } from "react";
import axios from "axios";

const VoiceChat: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // 🔹 TypeScript fix for SpeechRecognitionEvent
  type SpeechRecognitionEvent = Event & {
    results: { transcript: string }[][];
  };

  const startListening = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Your browser does not support voice recognition.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: any) => {
        console.error("Voice recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          setText(transcript);
          sendToAI(transcript);
        }
      };

      recognition.start();
    } catch (error) {
      console.error("Error initializing voice recognition:", error);
    }
  };

  const sendToAI = async (message: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:3000/chat", { message });
      setIsLoading(false);
      if (response.data?.response) {
        speak(response.data.response);
      }
    } catch (error) {
      console.error("AI response error:", error);
      setIsLoading(false);
    }
  };

  const speak = (message: string) => {
    try {
      if (!("speechSynthesis" in window)) {
        alert("Your browser does not support text-to-speech.");
        return;
      }

      const speech = new SpeechSynthesisUtterance(message);
      speech.lang = "en-US";
      speech.onstart = () => setIsSpeaking(true);
      speech.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(speech);
    } catch (error) {
      console.error("Error with speech synthesis:", error);
    }
  };

  return (
    <div className="voice-chat-container">
      <button onClick={startListening} disabled={isListening || isLoading}>
        {isListening ? "🎙️ Listening..." : "🎤 Speak"}
      </button>

      {/* Loading indicator while AI processes response */}
      {isLoading && <p className="loading">AI is thinking...</p>}

      {/* Speaking animation while AI is responding */}
      {isSpeaking && (
        <div className="speaking-animation">
          <span className="bubble">💬</span> AI is speaking...
        </div>
      )}

      <p aria-live="polite">{text}</p>
    </div>
  );
};

export default VoiceChat;
