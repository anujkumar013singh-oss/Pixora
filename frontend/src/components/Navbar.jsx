import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isLanding = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';
  if (isDashboard) return null;
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'About', href: '/#about' },
  ];

  const handleNavClick = (href) => {
    setMenuOpen(false);
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      if (location.pathname === '/') {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(id);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#05050a]/85 backdrop-blur-2xl border-b border-blue-900/15 shadow-[0_1px_30px_-15px_rgba(59,130,246,0.15)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to={user ? '/dashboard' : '/'}
            className="flex items-center gap-2.5 group"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-600/20"
              whileHover={{ scale: 1.05, rotate: -3 }}
              transition={{ duration: 0.3 }}
            >
              P
            </motion.div>
            <span className="text-xl font-bold tracking-tight text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}>
              PIXORA
            </span>
          </Link>

          {/* Desktop nav links — only on landing */}
          {isLanding && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="relative px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg transition-all duration-300 group"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full group-hover:w-4/5 transition-all duration-300" />
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg transition-colors duration-300"
                  style={{ fontFamily: "'Sen', sans-serif" }}>
                  Dashboard
                </Link>
                <span className="text-sm text-zinc-600" style={{ fontFamily: "'Cabin', sans-serif" }}>{user.name}</span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
                  style={{ fontFamily: "'Sen', sans-serif" }}>
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                {isLanding && (
                  <button
                    onClick={() => handleNavClick('/signup')}
                    className="relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg overflow-hidden group"
                    style={{ fontFamily: "'Sen', sans-serif" }}>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg" />
                    <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.15),transparent_60%)]" />
                    <span className="relative">Get Started</span>
                  </button>
                )}
                {!isLanding && (
                  <>
                    <Link to="/login"
                      className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg transition-colors duration-300"
                      style={{ fontFamily: "'Sen', sans-serif" }}>
                      Login
                    </Link>
                    <Link to="/signup"
                      className="relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg overflow-hidden group"
                      style={{ fontFamily: "'Sen', sans-serif" }}>
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg" />
                      <span className="relative">Sign Up</span>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <motion.span
              className="block w-5 h-[1.5px] bg-zinc-400 rounded-full"
              animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="block w-5 h-[1.5px] bg-zinc-400 rounded-full"
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span
              className="block w-5 h-[1.5px] bg-zinc-400 rounded-full"
              animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-800/50 bg-[#05050a]/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  {link.label}
                </button>
              ))}
              <hr className="my-3 border-zinc-800" />
              {user ? (
                <>
                  <Link to="/dashboard"
                    className="block px-4 py-3 text-sm font-medium text-zinc-300 hover:text-white rounded-lg"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                    onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                    className="block w-full text-left px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white rounded-lg"
                    style={{ fontFamily: "'Sen', sans-serif" }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login"
                    className="block px-4 py-3 text-sm font-medium text-zinc-300 hover:text-white rounded-lg"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                    onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); handleNavClick('/signup'); }}
                    className="block w-full text-left px-4 py-3 mt-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600"
                    style={{ fontFamily: "'Sen', sans-serif" }}>
                    Get Started
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
