import React from 'react';
import { Bot } from 'lucide-react';

const ChatBubble = ({ message, isAI }) => {
  if (!isAI) {
    return (
      <div className="flex items-start gap-2 max-w-[85%] ml-auto justify-end mb-5 group">
        <div className="bg-premium-sidebar text-white p-4 px-5 rounded-[20px] rounded-tr-[4px] shadow-md transition-transform transform group-hover:scale-[1.01] hover:shadow-glow">
          <p className="text-sm font-medium tracking-wide leading-relaxed">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3.5 max-w-[92%] mb-5">
      <div className="w-9 h-9 rounded-full bg-premium-sidebar flex items-center justify-center text-gold-500 shrink-0 shadow-sm mt-1 border border-gold-500/20">
        <Bot size={16} />
      </div>
      <div className="bg-white border border-gray-100 p-5 rounded-[20px] rounded-tl-[4px] shadow-soft transition-transform transform hover:shadow-float">
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
          {message}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
