import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import ConvertWidget from '../components/ConvertWidget';
import RemoveBgWidget from '../components/RemoveBgWidget';
import HistoryList from '../components/HistoryList';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('convert');
  const canvasRef = useRef(null);

  const tabs = [
    { key: 'convert', label: 'Convert', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { key: 'removebg', label: 'Remove BG', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Animated background canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * 1600, y: Math.random() * 900,
      r: Math.random() * 1.2 + 0.3, a: Math.random(), da: (Math.random() - 0.5) * 0.008
    }));

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.a += s.da;
        if (s.a > 1 || s.a < 0) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${s.a * 0.5})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#05050a] overflow-hidden">
      {/* Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Grid overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(56,189,248,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Radial glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none z-[1]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none z-[1]" />

      {/* Nav */}
      <nav className="relative z-20 border-b border-zinc-800/30 bg-[#05050a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-600/20"
                 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '18px', lineHeight: 1 }}>
              P
            </div>
            <span className="text-lg font-semibold text-white tracking-tight" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Pixora</span>
          </div>

          {/* User info */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-zinc-300" style={{ fontFamily: "'Cabin', sans-serif" }}>{user?.name || 'User'}</p>
              <p className="text-[11px] text-zinc-600" style={{ fontFamily: "'Cabin', sans-serif" }}>{user?.email || ''}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-blue-600/20"
                 style={{ fontFamily: "'Sen', sans-serif" }}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout}
              className="text-xs font-medium text-zinc-500 hover:text-red-400 transition-all px-3 py-2 rounded-xl hover:bg-red-500/10"
              style={{ fontFamily: "'Sen', sans-serif" }}>
              <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Creator'}
          </h1>
          <p className="text-sm text-zinc-500 mt-1" style={{ fontFamily: "'Cabin', sans-serif" }}>
            Convert images to universal links or remove their backgrounds
          </p>
        </motion.div>

        {/* Tabs + widgets row */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Left: Tab bar + active widget */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex-1 min-w-0">
            {/* Tab bar */}
            <div className="flex gap-1 p-1 bg-zinc-900/40 backdrop-blur-sm rounded-xl border border-zinc-800/30 mb-6 w-fit">
              {tabs.map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                    activeTab === t.key ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  style={{ fontFamily: "'Sen', sans-serif" }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={t.icon} />
                  </svg>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Active widget */}
            <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              {activeTab === 'convert' ? (
                <ConvertWidget onConversion={() => setRefreshTrigger(prev => prev + 1)} />
              ) : (
                <RemoveBgWidget onConversion={() => setRefreshTrigger(prev => prev + 1)} />
              )}
            </motion.div>
          </motion.div>

          {/* Right: Quick stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="w-full lg:w-64 space-y-4 flex-shrink-0">
            <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-zinc-800/40 p-5 shadow-2xl">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4"
                  style={{ fontFamily: "'Chakra Petch', monospace" }}>Quick Actions</h3>
              <div className="space-y-2">
                <button onClick={() => setActiveTab('convert')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === 'convert' ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20' : 'bg-zinc-900/30 text-zinc-400 hover:bg-zinc-900/60 border border-transparent'
                  }`}
                  style={{ fontFamily: "'Sen', sans-serif" }}>Create Universal Link</button>
                <button onClick={() => setActiveTab('removebg')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === 'removebg' ? 'bg-cyan-600/15 text-cyan-400 border border-cyan-500/20' : 'bg-zinc-900/30 text-zinc-400 hover:bg-zinc-900/60 border border-transparent'
                  }`}
                  style={{ fontFamily: "'Sen', sans-serif" }}>Remove Background</button>
              </div>
            </div>
            <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-zinc-800/40 p-5 shadow-2xl">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3"
                  style={{ fontFamily: "'Chakra Petch', monospace" }}>Tip</h3>
              <p className="text-sm text-zinc-500 leading-relaxed" style={{ fontFamily: "'Cabin', sans-serif" }}>
                Use <span className="text-zinc-400 font-mono">Paste URL</span> mode for images already on the web — no download needed.
              </p>
            </div>
          </motion.div>
        </div>

        {/* History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <HistoryList refreshTrigger={refreshTrigger} />
        </motion.div>
      </main>
    </div>
  );
}
