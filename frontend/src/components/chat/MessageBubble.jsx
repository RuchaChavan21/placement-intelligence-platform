import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Database, BookOpen, Copy, Check, AlertTriangle } from 'lucide-react';
import { formatMessage } from '../../lib/formatMessage';

const SourceChip = ({ citation }) => {
  if (!citation) return null;
  const isSql = /sql/i.test(citation);
  const Icon = isSql ? Database : BookOpen;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-300">
      <Icon size={12} className="text-gold-400" />
      {isSql ? 'Placement database' : 'Knowledge base'}
    </span>
  );
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable (e.g. insecure context); nothing to do
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy answer"
      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-slate-200"
    >
      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
    </button>
  );
};

const MessageBubble = ({ message }) => {
  const { role, text, citation, coverage, isError } = message;

  if (role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-gradient-to-br from-gold-400 to-gold-600 px-4 py-3 text-[15px] font-medium leading-relaxed text-ink-950 shadow-glow sm:max-w-[75%]">
          {text}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3"
    >
      <div
        className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
          isError
            ? 'bg-rose-500/15 text-rose-300'
            : 'bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950 shadow-glow'
        }`}
      >
        {isError ? <AlertTriangle size={15} /> : <Sparkles size={15} strokeWidth={2.5} />}
      </div>

      <div className="min-w-0 max-w-[85%] sm:max-w-[80%]">
        <div
          className={`space-y-2 break-words rounded-2xl rounded-tl-md px-4 py-3 text-[15px] leading-relaxed ${
            isError ? 'border border-rose-500/25 bg-rose-500/[0.07] text-rose-100' : 'glass text-slate-200'
          }`}
        >
          {formatMessage(text)}
        </div>

        {!isError && (citation || coverage) && (
          <div className="mt-2 flex flex-wrap items-center gap-2 pl-1">
            <SourceChip citation={citation} />
            {coverage && <span className="text-[11px] text-slate-500">{coverage}</span>}
            <CopyButton text={text} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
