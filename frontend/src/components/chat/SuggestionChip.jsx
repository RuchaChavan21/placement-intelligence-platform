import React from 'react';
import { TerminalSquare } from 'lucide-react';

const SuggestionChip = ({ text, onClick }) => {
  return (
    <button 
      onClick={() => onClick(text)}
      className="text-left text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:border-gold-400 hover:bg-gold-50/50 hover:text-gold-600 p-3.5 rounded-2xl transition-all shadow-sm flex items-center gap-3 group w-full hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-gold-100 transition-colors shrink-0">
        <TerminalSquare size={14} className="text-gray-400 group-hover:text-gold-500 transition-colors" />
      </div>
      <span className="line-clamp-2 leading-relaxed">{text}</span>
    </button>
  );
};

export default SuggestionChip;
