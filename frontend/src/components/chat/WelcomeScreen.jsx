import { motion } from 'framer-motion';
import { BarChart3, Wallet, Building2, Trophy, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  { icon: BarChart3, title: 'Top branch', query: 'Which branch has highest placements?' },
  { icon: Wallet, title: 'Average package', query: 'What is the average package?' },
  { icon: Building2, title: 'Top recruiters', query: 'Who are the top recruiters?' },
  { icon: Trophy, title: 'Highest package', query: 'What is the highest package offered?' },
];

const WelcomeScreen = ({ onPick }) => (
  <div className="flex min-h-full flex-col items-center justify-center px-4 py-10 text-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950 shadow-glow"
    >
      <Sparkles size={30} strokeWidth={2.2} />
    </motion.div>

    <motion.h2
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl"
    >
      Ask anything about
      <br />
      <span className="text-gradient">campus placements</span>
    </motion.h2>

    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mt-4 max-w-md text-sm text-slate-400 sm:text-base"
    >
      Branches, packages, recruiters and trends, answered instantly from real placement records.
    </motion.p>

    <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
      {SUGGESTIONS.map(({ icon: Icon, title, query }, i) => (
        <motion.button
          key={title}
          type="button"
          onClick={() => onPick(query)}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.07, duration: 0.45 }}
          whileHover={{ y: -3 }}
          className="glass group flex items-start gap-4 rounded-2xl p-4 text-left transition-colors hover:border-gold-500/40 hover:bg-white/[0.07]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 transition group-hover:bg-gold-500/20 group-hover:text-gold-300">
            <Icon size={19} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="mt-0.5 text-xs text-slate-400">{query}</p>
          </div>
        </motion.button>
      ))}
    </div>
  </div>
);

export default WelcomeScreen;
