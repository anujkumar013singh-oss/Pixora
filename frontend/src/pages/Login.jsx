import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-blue-400/20"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{
            y: [0, -30 - Math.random() * 30, 0],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => emailRef.current?.focus(), 800);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Email is required'); return; }
    if (!password) { setError('Password is required'); return; }
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full bg-transparent border-b text-base px-0 py-3 text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
      focused === field
        ? 'border-blue-400'
        : error
        ? 'border-red-500/40'
        : 'border-zinc-700/60 hover:border-zinc-500'
    }`;

  return (
    <div className="min-h-screen bg-[#05050a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Cinematic background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-[#05050a] to-cyan-950/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,_var(--tw-gradient-stops))] from-cyan-600/8 via-transparent to-transparent" />

      {/* Animated glow orbs */}
      <motion.div
        className="absolute top-1/4 -left-40 w-[400px] h-[400px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%)' }}
        animate={{ x: [0, 40, 0], y: [0, -25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 -right-40 w-[400px] h-[400px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4), transparent 70%)' }}
        animate={{ x: [0, -40, 0], y: [0, 25, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <Particles />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo + header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <Link to="/" className="inline-flex items-center gap-3 group">
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-blue-600/20"
              whileHover={{ scale: 1.05, rotate: -5 }}
              transition={{ duration: 0.3 }}
            >
              P
            </motion.div>
            <span className="text-3xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}>
              PIXORA
            </span>
          </Link>
          <motion.p
            className="mt-4 text-zinc-500 text-base"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Welcome back. Sign in to your account.
          </motion.p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-zinc-800/40 p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-7">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="bg-red-950/30 border border-red-900/30 text-red-400 px-4 py-3 rounded-xl text-sm"
                  style={{ fontFamily: "'Cabin', sans-serif" }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="relative">
              <label
                className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                  focused === 'email' || email
                    ? '-top-2.5 text-xs text-blue-400'
                    : 'top-3 text-base text-zinc-500'
                }`}
                style={{ fontFamily: "'Cabin', sans-serif" }}
              >
                Email address
              </label>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                className={inputClass('email')}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label
                className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                  focused === 'password' || password
                    ? '-top-2.5 text-xs text-blue-400'
                    : 'top-3 text-base text-zinc-500'
                }`}
                style={{ fontFamily: "'Cabin', sans-serif" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                className={inputClass('password')}
                autoComplete="current-password"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              className="relative w-full py-3.5 text-sm font-semibold text-white rounded-xl overflow-hidden transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-600/15"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl" />
              <span className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.12),transparent_60%)]" />
              <span className="relative flex items-center justify-center gap-2.5">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Signing in…</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </span>
            </motion.button>
          </form>
        </motion.div>

        {/* Footer links */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-sm text-zinc-600" style={{ fontFamily: "'Cabin', sans-serif" }}>
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
              Create one
            </Link>
          </p>
        </motion.div>

        {/* Bottom credit */}
        <motion.p
          className="mt-16 text-center text-xs text-zinc-700"
          style={{ fontFamily: "'Cabin', sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          &copy; {new Date().getFullYear()} Pixora
        </motion.p>
      </div>
    </div>
  );
}
