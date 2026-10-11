import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const TypingIndicator = ({ slow }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-start gap-3"
    role="status"
    aria-live="polite"
  >
    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950 shadow-glow">
      <Sparkles size={15} strokeWidth={2.5} />
    </div>
    <div>
      <div className="glass flex items-center gap-1.5 rounded-2xl rounded-tl-md px-4 py-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-gold-400 animate-bounce-dot"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
        <span className="sr-only">Thinking…</span>
      </div>
      {slow && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 pl-1 text-xs text-slate-500"
        >
          Waking up the server, the first reply can take up to a minute…
        </motion.p>
      )}
    </div>
  </motion.div>
);

export default TypingIndicator;
