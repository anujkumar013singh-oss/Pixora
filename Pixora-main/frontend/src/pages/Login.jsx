import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-black relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full p-10 bg-surface-2 border border-white/10 btn-sharp shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-display font-bold uppercase tracking-tighter mb-2">Welcome Back</h2>
          <p className="text-muted font-body text-sm tracking-wide uppercase">Enter your credentials to continue</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 btn-sharp text-xs font-bold uppercase tracking-widest mb-6"
          >
            {error}
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/5 btn-sharp py-4 pl-12 pr-4 text-white placeholder:text-muted focus:border-accent outline-none transition-all duration-300 font-body text-sm"
                placeholder="EMAIL ADDRESS"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/5 btn-sharp py-4 pl-12 pr-12 text-white placeholder:text-muted focus:border-accent outline-none transition-all duration-300 font-body text-sm"
                placeholder="PASSWORD"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-dark text-white py-5 btn-sharp font-extrabold text-sm uppercase tracking-[0.2em] transition-all duration-500 electric-glow-strong disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-muted font-body text-xs uppercase tracking-widest">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:underline font-bold transition-all">
              Get Started
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
