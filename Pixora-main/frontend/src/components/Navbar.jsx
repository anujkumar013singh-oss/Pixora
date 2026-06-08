import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'hero' },
    { name: 'About Us', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Contact', id: 'contact' },
  ];

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Brand */}
          <Link 
            to="/" 
            className="text-2xl md:text-3xl font-display font-bold tracking-tighter hover:text-accent transition-colors duration-300"
          >
            Pixora
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium tracking-wide uppercase hover:text-accent transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-sm font-medium tracking-wide uppercase hover:text-accent transition-colors duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-accent hover:bg-accent-dark text-white px-8 py-3 btn-sharp font-bold text-sm uppercase tracking-widest transition-all duration-300 electric-glow-strong"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-sm font-medium tracking-wide uppercase hover:text-accent transition-colors duration-300 border border-white/10 px-6 py-2 btn-sharp hover:border-accent"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-accent hover:bg-accent-dark text-white px-8 py-3 btn-sharp font-bold text-sm uppercase tracking-widest transition-all duration-300 electric-glow-strong"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full bg-surface-1 border-b border-white/10 md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-xl font-display font-bold text-left hover:text-accent"
                >
                  {link.name}
                </button>
              ))}
              <div className="h-[1px] bg-white/5 my-2" />
              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-xl font-display font-bold text-left text-accent"
                >
                  Log Out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-xl font-display font-bold text-left hover:text-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
