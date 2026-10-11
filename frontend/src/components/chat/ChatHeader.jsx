import { Sparkles, SquarePen } from 'lucide-react';

const ChatHeader = ({ onNewChat, showNewChat }) => (
  <header className="shrink-0 border-b border-white/[0.06] bg-ink-950/40 backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950 shadow-glow">
          <Sparkles size={18} strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <h1 className="font-display text-lg font-semibold tracking-tight text-white">PlacementGPT</h1>
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Online
          </p>
        </div>
      </div>

      {showNewChat && (
        <button
          type="button"
          onClick={onNewChat}
          className="glass flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:border-gold-500/40 hover:text-white"
        >
          <SquarePen size={15} />
          <span className="hidden sm:inline">New chat</span>
        </button>
      )}
    </div>
  </header>
);

export default ChatHeader;
