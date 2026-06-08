import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Eye, EyeOff, User, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (formData.username.length < 3) return 'Username must be at least 3 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email address';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-black relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full p-10 bg-surface-2 border border-white/10 btn-sharp shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-display font-bold uppercase tracking-tighter mb-2">Create Account</h2>
          <p className="text-muted font-body text-sm tracking-wide uppercase">Join the universal asset network</p>
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

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-black border border-white/5 btn-sharp py-4 pl-12 pr-4 text-white placeholder:text-muted focus:border-accent outline-none transition-all duration-300 font-body text-sm"
                placeholder="USERNAME"
              />
            </div>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black border border-white/5 btn-sharp py-4 pl-12 pr-4 text-white placeholder:text-muted focus:border-accent outline-none transition-all duration-300 font-body text-sm"
                placeholder="EMAIL ADDRESS"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black border border-white/5 btn-sharp py-4 pl-12 pr-12 text-white placeholder:text-muted focus:border-accent outline-none transition-all duration-300 font-body text-sm"
                placeholder="CREATE PASSWORD"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative group">
              <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-black border border-white/5 btn-sharp py-4 pl-12 pr-12 text-white placeholder:text-muted focus:border-accent outline-none transition-all duration-300 font-body text-sm"
                placeholder="CONFIRM PASSWORD"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
              'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-muted font-body text-xs uppercase tracking-widest">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline font-bold transition-all">
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
