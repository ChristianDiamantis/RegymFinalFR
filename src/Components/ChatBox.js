import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "../styles/ChatBox.css";

const API_KEY = "AIzaSyDAELhJKITll8OzIJFa5nZJSju3O3GSJ48Y"; 

const genAI = new GoogleGenerativeAI(API_KEY);

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text: input }]);
    setInput("");
    setIsTyping(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      
      const prompt = `
        You are ReGym AI Assistant. Only answer questions related to ReGym, gym equipment, buying/selling fitness gear, or local deals.
        If someone asks anything else, politely redirect them back to ReGym topics.

        User Question: "${input}"
      `;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      setMessages((prev) => [...prev, { type: "bot", text: response }]);
    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages((prev) => [...prev, { type: "bot", text: "Sorry, something went wrong!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div>
      <button onClick={toggleChat} className="chat-toggle-button">
        {isOpen ? "Close Chat" : "Chat with ReGym AI 🤖"}
      </button>

      {isOpen && (
        <div className="chatbox-container">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.type === "user" ? "chat-message user" : "chat-message bot"}
              >
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className="chat-message bot">
                ReGym AI is typing...
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about ReGym!"
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
