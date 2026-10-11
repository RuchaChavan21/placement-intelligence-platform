import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import AnimatedBackground from '../components/chat/AnimatedBackground';
import { login, register, AuthError } from '../lib/auth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(mode, { name, email, password, confirm }) {
  const errors = {};
  if (mode === 'register' && name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (mode === 'register' && password.length < 8) errors.password = 'Use at least 8 characters.';
  if (mode === 'login' && !password) errors.password = 'Enter your password.';
  if (mode === 'register' && confirm !== password) errors.confirm = "Passwords don't match.";
  return errors;
}

const Field = ({ icon: Icon, label, error, type = 'text', value, onChange, autoComplete, trailing }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-medium text-slate-400">{label}</span>
    <div
      className={`flex items-center gap-3 rounded-xl border bg-white/[0.03] px-3.5 transition focus-within:border-gold-500/50 focus-within:bg-white/[0.05] ${
        error ? 'border-rose-500/50' : 'border-white/10'
      }`}
    >
      <Icon size={16} className="shrink-0 text-slate-500" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className="w-full bg-transparent py-3 text-[15px] text-white placeholder-slate-600 focus:outline-none"
      />
      {trailing}
    </div>
    {error && <span className="mt-1.5 block text-xs text-rose-300">{error}</span>}
  </label>
);

const AuthPage = ({ onAuthenticated }) => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === 'register';
  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    // clear a field's error as soon as the user edits it
    setErrors((errs) => (errs[key] ? { ...errs, [key]: undefined } : errs));
    setFormError('');
  };

  const switchMode = () => {
    setMode(isRegister ? 'login' : 'register');
    setErrors({});
    setFormError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(mode, form);
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      const user = isRegister ? await register(form) : await login(form);
      onAuthenticated(user);
    } catch (err) {
      setFormError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((s) => !s)}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      className="text-slate-500 transition hover:text-slate-300"
    >
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-y-auto px-4 py-10">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950 shadow-glow">
            <Sparkles size={26} strokeWidth={2.2} />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {isRegister
              ? 'Join PlacementGPT to explore campus placement insights.'
              : 'Log in to PlacementGPT to continue.'}
          </p>
        </div>

        <form onSubmit={submit} noValidate className="glass space-y-4 rounded-3xl p-6 sm:p-8">
          <AnimatePresence initial={false}>
            {isRegister && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Field icon={User} label="Full name" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
              </motion.div>
            )}
          </AnimatePresence>

          <Field icon={Mail} label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />

          <Field
            icon={Lock}
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            trailing={passwordToggle}
          />

          <AnimatePresence initial={false}>
            {isRegister && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Field
                  icon={Lock}
                  label="Confirm password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={set('confirm')}
                  error={errors.confirm}
                  autoComplete="new-password"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {formError && (
            <p role="alert" className="rounded-xl border border-rose-500/25 bg-rose-500/[0.08] px-3.5 py-2.5 text-sm text-rose-200">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 py-3 text-[15px] font-semibold text-ink-950 shadow-glow transition hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                {isRegister ? 'Create account' : 'Log in'}
                <ArrowRight size={17} className="transition group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={switchMode} className="font-semibold text-gold-400 transition hover:text-gold-300">
            {isRegister ? 'Log in' : 'Create one'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
