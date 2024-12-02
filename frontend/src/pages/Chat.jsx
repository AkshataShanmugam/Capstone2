import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// ShimmerText component (unchanged)
const ShimmerText = ({ text }) => (
  <div className="relative overflow-hidden">
    <span className="relative z-10 text-2xl font-bold">{text}</span>
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
  </div>
);

// Main Chat component
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch username logic (unchanged)
  useEffect(() => {
    const fetchUsername = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        setUsername('Guest');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/get-username', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching username:', error);
        setUsername('Guest');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsername();
  }, []);

  // Scroll to bottom logic (unchanged)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  // Handle send message logic (updated)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
  
    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
  
    // Reset textarea height
    e.target.querySelector('textarea').style.height = 'auto';
  
    try {
      // Prepare conversation history as a prompt
      const formattedHistory = messages
        .map((msg) => `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}`)
        .join('\n');
  
      const fullPrompt = `
        The following is a conversation with a helpful robot that can only answer questions about movies. 
        The robot cannot answer questions outside this domain.

        Here is the conversation history: ${formattedHistory}
        Current user prompt: ${inputMessage}
        Response:
      `;
  
      // Make API call with the full conversation history and the current prompt
      const response = await fetch(`http://localhost:8000/chat/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          query: fullPrompt,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
  
      const botMessage = { text: data.response || 'Sorry, I did not understand.', sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
  
      // Optionally store conversation history in localStorage
      sessionStorage.setItem("chatHistory", JSON.stringify([...messages, userMessage, botMessage]));
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { text: 'Sorry, I encountered an error.', sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  useEffect(() => {
    const savedHistory = sessionStorage.getItem("chatHistory");
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    }
  }, []);  
  

  // Scroll to bottom effect (unchanged)
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#f2ecec]">
      <header className="bg-[#e6e3e3] p-4 flex justify-between items-center shadow-md">
        {isLoading ? (
          <ShimmerText text="Loading..." />
        ) : (
          <h2 className="text-2xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400">
              Hello, {username}!
            </span>
          </h2>
        )}
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          Movie-Bot
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg break-words ${
                message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-[#bc69bc] text-white'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>
      <footer className="bg-[#e6e3e3] p-4 shadow-md">
        <form onSubmit={handleSendMessage} className="flex items-center justify-center">
          <div className="w-full max-w-4xl px-5 sm:px-0">
            <div className="flex items-center space-x-2">
              <textarea
                value={inputMessage}
                onChange={handleInputChange}
                className="flex-grow bg-white text-black rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
                placeholder="Ask Chatbot"
                rows={1}
                style={{ height: 'auto' }}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </footer>
    </div>
  );
};

export default Chat;