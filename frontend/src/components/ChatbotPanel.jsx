import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBubble from './chat/ChatBubble';
import SuggestionChip from './chat/SuggestionChip';
import LoadingSkeleton from './ui/LoadingSkeleton';

const ChatbotPanel = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I am your AI Placement Assistant. I can analyze placement trends, fetch interview experiences, or generate reports from our database.",
      isAI: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQueries = [
    "Which branch has highest placements?",
    "What companies visited most?",
    "Show Juspay interview experience",
    "Average package for CSE?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const query = typeof text === 'string' ? text : inputValue;
    if (!query.trim()) return;

    const newUserMsg = { id: Date.now(), text: query, isAI: false };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/chatbot/chat?query=${encodeURIComponent(query)}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        }
      });
      const data = await response.json();
      
      const aiResponse = { 
        id: Date.now() + 1, 
        text: data.answer || "Sorry, I encountered an error processing your query.", 
        isAI: true 
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = {
        id: Date.now() + 1,
        text: "Sorry, I couldn't connect to the backend server.",
        isAI: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.aside 
      initial={{ x: 380 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-[380px] bg-white border-l border-gray-100 h-screen fixed right-0 top-0 flex flex-col shadow-2xl z-30"
    >
      {/* Header */}
      <div className="p-7 border-b border-gray-50 flex items-center justify-between bg-white shrink-0 z-10 shadow-sm relative">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-premium-sidebar flex items-center justify-center text-gold-500 shadow-glow relative">
            <Bot size={24} />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white"></span>
            </span>
          </div>
          <div>
            <h2 className="font-extrabold text-dark tracking-tight text-lg">AI Assistant</h2>
            <p className="text-xs text-gray-500 font-semibold mt-0.5 tracking-wide uppercase">
              Online & Ready
            </p>
          </div>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-7 bg-[#FAFAFA] flex flex-col">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: idx === 0 ? 0.3 : 0 }}
            >
              <ChatBubble message={msg.text} isAI={msg.isAI} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Suggested Queries */}
        <AnimatePresence>
          {messages.length === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="space-y-3 mt-4 mb-6"
            >
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-12 mb-3">Suggested Queries</p>
              <div className="pl-12 flex flex-col gap-2.5">
                {suggestedQueries.map((prompt, i) => (
                  <SuggestionChip key={i} text={prompt} onClick={() => handleSend(prompt)} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 ml-12"
          >
            <LoadingSkeleton type="typing" />
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-100 bg-white shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.02)]">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center bg-gray-50 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-gold-500/20 focus-within:border-gold-400/50 transition-all p-1.5 shadow-inner"
        >
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask placement analytics..." 
            className="w-full bg-transparent pl-4 pr-14 py-3.5 text-sm font-medium focus:outline-none text-dark placeholder-gray-400"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 w-10 h-10 rounded-xl bg-premium-sidebar text-white flex items-center justify-center hover:bg-black transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-glow group"
          >
            <Send size={16} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>
      </div>
    </motion.aside>
  );
};

export default ChatbotPanel;
