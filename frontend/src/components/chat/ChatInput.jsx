import { useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

const MAX_HEIGHT = 160;

const ChatInput = ({ value, onChange, onSend, disabled }) => {
  const textareaRef = useRef(null);

  // grow with content up to MAX_HEIGHT, then scroll
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      className="glass flex items-end gap-2 rounded-2xl p-2 transition focus-within:border-gold-500/40 focus-within:shadow-glow"
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about placements…"
        aria-label="Message"
        className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] text-white placeholder-slate-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={!canSend}
        aria-label="Send message"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950 transition hover:shadow-glow disabled:cursor-not-allowed disabled:from-white/10 disabled:to-white/10 disabled:text-slate-500"
      >
        <ArrowUp size={18} strokeWidth={2.5} />
      </button>
    </form>
  );
};

export default ChatInput;
