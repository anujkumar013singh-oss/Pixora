import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from '../components/Reveal';
import SmoothScroll from '../components/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

const fadeUp = {
  hidden: { y: 60, opacity: 0 },
  visible: (i = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, delay: i * 0.15, ease: [0.25, 0.4, 0.25, 1] }
  })
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
};

const scaleIn = {
  hidden: { scale: 0.85, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] } }
};

const services = [
  {
    title: 'Universal Links',
    desc: 'Every image gets a permanent, CDN-backed URL hosted on Cloudinary. Share anywhere — social media, forums, websites, emails. No expiration. Never broken.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    )
  },
  {
    title: 'Background Removal',
    desc: 'Remove backgrounds from any image with one click. Works on uploads and existing Pixora links alike. Professional-grade results powered by remove.bg.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    )
  },
  {
    title: 'Secure & Private',
    desc: 'Your images and history are securely linked to your account. JWT-based auth with HttpOnly cookies. Enterprise-grade security, zero compromises.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  }
];

export default function Landing() {
  const { user } = useAuth();
  const heroRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-badge', { y: 30, opacity: 0, duration: 0.8 })
        .from('.hero-line', { y: 80, opacity: 0, duration: 1, stagger: 0.15 }, '-=0.4')
        .from('.hero-desc', { y: 40, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.hero-actions', { y: 40, opacity: 0, duration: 0.8 }, '-=0.4')
        .from('.hero-social', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3');

      const glow = hero.querySelector('.hero-glow');
      if (glow) {
        gsap.to(glow, {
          scale: 1.2,
          opacity: 0.6,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      gsap.to('.float-particle', {
        y: -30,
        duration: 2.5 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.3
      });
    }, hero);

    return () => ctx.revert();
  }, []);

  return (
    <SmoothScroll>
    <div className="min-h-screen bg-[#05050a] text-white overflow-x-hidden">
      {/* ========== HERO ========== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Depth layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-[#05050a] to-[#05050a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,_var(--tw-gradient-stops))] from-cyan-600/10 via-transparent to-transparent" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3), transparent 70%)' }}
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="float-particle absolute w-1 h-1 rounded-full"
              style={{
                background: i % 2 === 0 ? '#3b82f6' : '#06b6d4',
                left: `${5 + Math.random() * 90}%`,
                top: `${5 + Math.random() * 90}%`,
              }}
              animate={{
                y: [0, -40 - Math.random() * 40, 0],
                opacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div>
              <motion.div
                className="hero-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                </span>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-300"
                      style={{ fontFamily: "'Chakra Petch', monospace" }}>
                  Now in Public Beta
                </span>
              </motion.div>

              <h1 className="hero-line text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.82] tracking-tight text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                <span className="block">Turn Any</span>
                <span className="block">Image Into</span>
                <span className="block bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent pb-1">
                  Universal Link
                </span>
              </h1>

              <p className="hero-desc mt-6 text-base sm:text-lg text-zinc-400 max-w-lg leading-relaxed"
                 style={{ fontFamily: "'Cabin', sans-serif" }}>
                Upload an image, get a permanent hosted URL that works everywhere.
                No expiration. No hassle. Background removal included.
              </p>

              <div className="hero-actions mt-10 flex flex-col sm:flex-row items-start gap-3">
                {user ? (
                  <Link to="/dashboard"
                    className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-white rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20"
                    style={{ fontFamily: "'Sen', sans-serif" }}>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl" />
                    <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.15),transparent_60%)]" />
                    <span className="relative flex items-center gap-2">
                      Go to Dashboard
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup"
                      className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-white rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20"
                      style={{ fontFamily: "'Sen', sans-serif" }}>
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl" />
                      <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.15),transparent_60%)]" />
                      <span className="relative flex items-center gap-2">
                        Get Started Free
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </Link>
                    <Link to="/login"
                      className="px-7 py-3.5 text-sm font-medium text-zinc-400 hover:text-white rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all duration-300"
                      style={{ fontFamily: "'Sen', sans-serif" }}>
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="hero-social mt-12 flex items-center gap-8 text-zinc-600">
                <div className="flex -space-x-2.5">
                  {[1,2,3,4].map(i => (
                    <div key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border-2 border-[#05050a] flex items-center justify-center text-[10px] text-zinc-500 font-medium">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-[#05050a] flex items-center justify-center text-[10px] text-white font-bold">
                    +
                  </div>
                </div>
                <div>
                  <p className="text-sm" style={{ fontFamily: "'Cabin', sans-serif" }}>
                    <span className="text-white font-semibold">500+</span>
                    <span className="text-zinc-600"> images converted</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Mockup card */}
            <div className="hidden lg:flex justify-center">
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              >
                {/* Glow behind card */}
                <div className="absolute -inset-10 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
                {/* Card */}
                <div className="relative w-[320px] bg-[#0c0c1a] rounded-2xl border border-zinc-800/60 overflow-hidden shadow-2xl">
                  {/* Card header */}
                  <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800/60">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-[11px] text-zinc-500 ml-2 font-mono">pixora.app</span>
                  </div>
                  {/* Card body */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        P
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                          Converter
                        </p>
                        <p className="text-[11px] text-zinc-500" style={{ fontFamily: "'Cabin', sans-serif" }}>
                          Drop an image to start
                        </p>
                      </div>
                    </div>
                    {/* Upload area */}
                    <div className="border-2 border-dashed border-zinc-700/60 rounded-xl p-6 text-center">
                      <svg className="w-8 h-8 text-zinc-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-zinc-500" style={{ fontFamily: "'Cabin', sans-serif" }}>
                        Choose file or paste URL
                      </p>
                    </div>
                    {/* Result placeholder */}
                    <div className="h-10 bg-blue-500/10 rounded-lg border border-blue-500/20 flex items-center px-4">
                      <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse mr-2" />
                      <span className="text-xs text-blue-300/60" style={{ fontFamily: "'Cabin', sans-serif" }}>
                        pixora.app/u/8xK2m...
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-600"
                style={{ fontFamily: "'Chakra Petch', monospace" }}>
            Scroll
          </span>
          <motion.div
            className="w-4 h-6 rounded-full border border-zinc-700 flex justify-center pt-1"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-1.5 rounded-full bg-zinc-400"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ========== SERVICES ========== */}
      <section id="services" className="relative py-32 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-20">
              <motion.span
                className="text-xs font-semibold tracking-[0.3em] uppercase text-blue-400"
                style={{ fontFamily: "'Chakra Petch', monospace" }}
                variants={fadeUp} initial="hidden" whileInView="visible"
              >
                What We Offer
              </motion.span>
              <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Built for Seamless
                <br />
                Image Hosting
              </h2>
              <p className="mt-4 text-zinc-500 max-w-md mx-auto"
                 style={{ fontFamily: "'Cabin', sans-serif" }}>
                Everything you need to host, transform, and share images at scale.
              </p>
            </div>
          </Reveal>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <div className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-zinc-800/50 to-transparent hover:from-blue-700/30 transition-all duration-700">
                  <div className="relative h-full bg-[#08080f] rounded-2xl p-8 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-blue-600/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white mb-6 relative">
                      {s.icon}
                    </div>
                    <h3 className="text-xl text-white font-semibold mb-3 relative"
                        style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                      {s.title}
                    </h3>
                    <p className="text-zinc-400 leading-relaxed text-sm relative"
                       style={{ fontFamily: "'Kulim Park', sans-serif" }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== ABOUT ME ========== */}
      <section id="about" className="relative py-32 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-cyan-400"
                    style={{ fontFamily: "'Chakra Petch', monospace" }}>
                Behind Pixora
              </span>
              <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Crafted by{' '}
                <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Anuj Singh
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-5 gap-12 items-center">
              {/* DP */}
              <Reveal direction="left" className="md:col-span-2 flex justify-center">
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-2xl opacity-40 group-hover:opacity-70 blur-lg transition-opacity duration-500" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-2xl opacity-60 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
                  <motion.img
                    src="https://ik.imagekit.io/yrpp2zi5o/Anuj%20DP.jpeg"
                    alt="Anuj Singh"
                    className="relative w-56 h-56 sm:w-64 sm:h-64 object-cover rounded-2xl border-2 border-zinc-800/50"
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
                  />
                </motion.div>
              </Reveal>

              {/* Bio */}
              <Reveal direction="right" className="md:col-span-3 space-y-6">
                <motion.div
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-500/15 bg-blue-500/5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-xs font-medium text-blue-300 tracking-wider"
                        style={{ fontFamily: "'Chakra Petch', monospace" }}>
                    FULL-STACK DEVELOPER
                  </span>
                </motion.div>

                <motion.p
                  className="text-zinc-300 text-lg leading-relaxed"
                  style={{ fontFamily: "'Kulim Park', sans-serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  I'm a passionate full-stack developer specializing in building
                  modern, scalable web applications. Pixora is my vision of making
                  image hosting universally accessible — no friction, no expiration.
                </motion.p>

                <motion.p
                  className="text-zinc-500 leading-relaxed"
                  style={{ fontFamily: "'Cabin', sans-serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Every pixel matters. Every link should last forever.
                  That's the philosophy behind Pixora.
                </motion.p>

                {/* Social */}
                <motion.div
                  className="flex flex-wrap gap-3 pt-2"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    { href: 'https://anujsingh-developer.vercel.app/', label: 'Portfolio', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z', color: 'from-zinc-800 to-zinc-900', border: 'border-zinc-700 hover:border-zinc-600' },
                    { href: 'https://github.com/anujkumar013singh-oss', label: 'GitHub', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z', color: 'from-zinc-800 to-zinc-900', border: 'border-zinc-700 hover:border-zinc-600' },
                    { href: 'https://api.whatsapp.com/send/?phone=9654673316&text=Hi+I+saw+your+portfolio+and+want+to+connect&type=phone_number&app_absent=0', label: 'WhatsApp', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z', color: 'from-emerald-800/80 to-zinc-900', border: 'border-emerald-800/50 hover:border-emerald-700/50' },
                    { href: 'https://www.instagram.com/lone_.03/', label: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z', color: 'from-blue-800/80 to-zinc-900', border: 'border-blue-800/50 hover:border-blue-700/50' },
                    { href: 'mailto:alonesurvivor03@gmail.com', label: 'Email', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'from-amber-800/80 to-zinc-900', border: 'border-amber-800/50 hover:border-amber-700/50', stroke: true },
                  ].map((social, i) => (
                    <motion.a key={i} href={social.href} target="_blank" rel="noopener noreferrer"
                      variants={scaleIn}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className={`group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl overflow-hidden transition-all duration-300`}
                      style={{ fontFamily: "'Sen', sans-serif" }}>
                      <span className={`absolute inset-0 bg-gradient-to-r ${social.color} rounded-xl border ${social.border} transition-colors`} />
                      <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.05),transparent_60%)]" />
                      {social.stroke ? (
                        <svg className="relative w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={social.icon} /></svg>
                      ) : (
                        <svg className="relative w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={social.icon} /></svg>
                      )}
                      <span className="relative">{social.label}</span>
                    </motion.a>
                  ))}
                </motion.div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />

        <Reveal>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-blue-400"
                  style={{ fontFamily: "'Chakra Petch', monospace" }}>
              Get Started
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Ready to Convert?
            </h2>
            <p className="mt-4 text-zinc-400 text-lg max-w-lg mx-auto"
               style={{ fontFamily: "'Cabin', sans-serif" }}>
              Upload your first image and get a universal link in seconds.
              No credit card. No commitment. Just results.
            </p>
            <div className="mt-10">
              {user ? (
                <Link to="/dashboard"
                  className="group relative inline-flex items-center gap-2 px-10 py-4 text-base font-semibold text-white rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ fontFamily: "'Sen', sans-serif" }}>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl" />
                  <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.15),transparent_60%)]" />
                  <span className="relative flex items-center gap-2">
                    Open Dashboard
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              ) : (
                <Link to="/signup"
                  className="group relative inline-flex items-center gap-2 px-10 py-4 text-base font-semibold text-white rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ fontFamily: "'Sen', sans-serif" }}>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl" />
                  <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.15),transparent_60%)]" />
                  <span className="relative flex items-center gap-2">
                    Create Free Account
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="relative border-t border-zinc-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                PIXORA
              </span>
              <p className="mt-3 text-zinc-500 text-sm leading-relaxed"
                 style={{ fontFamily: "'Cabin', sans-serif" }}>
                Universal image links that last forever.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-400 mb-4"
                  style={{ fontFamily: "'Chakra Petch', monospace" }}>
                Platform
              </h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-zinc-500 hover:text-blue-400 transition">Home</Link></li>
                <li><a href="#services" className="text-sm text-zinc-500 hover:text-blue-400 transition">Services</a></li>
                <li><a href="#about" className="text-sm text-zinc-500 hover:text-blue-400 transition">About</a></li>
                {!user && <li><Link to="/signup" className="text-sm text-zinc-500 hover:text-blue-400 transition">Get Started</Link></li>}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-400 mb-4"
                  style={{ fontFamily: "'Chakra Petch', monospace" }}>
                Connect
              </h4>
              <ul className="space-y-2">
                <li><a href="https://github.com/anujkumar013singh-oss" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-blue-400 transition">GitHub</a></li>
                <li><a href="https://www.instagram.com/lone_.03/" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-blue-400 transition">Instagram</a></li>
                <li><a href="mailto:alonesurvivor03@gmail.com" className="text-sm text-zinc-500 hover:text-blue-400 transition">Email</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-400 mb-4"
                  style={{ fontFamily: "'Chakra Petch', monospace" }}>
                Creator
              </h4>
              <div className="flex items-center gap-3 mb-3">
                <img src="https://ik.imagekit.io/yrpp2zi5o/Anuj%20DP.jpeg" alt="Anuj Singh" className="w-8 h-8 rounded-lg object-cover" />
                <div>
                  <p className="text-sm text-zinc-300 font-medium"
                     style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Anuj Singh</p>
                  <a href="https://anujsingh-developer.vercel.app/" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-zinc-500 hover:text-blue-400 transition">
                    Portfolio ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-600"
               style={{ fontFamily: "'Cabin', sans-serif" }}>
              &copy; {new Date().getFullYear()} Pixora. Crafted by{' '}
              <a href="https://anujsingh-developer.vercel.app/" target="_blank" rel="noopener noreferrer"
                 className="text-zinc-400 hover:text-blue-400 transition">Anuj Singh</a>.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/anujkumar013singh-oss" target="_blank" rel="noopener noreferrer"
                className="text-zinc-600 hover:text-blue-400 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://www.instagram.com/lone_.03/" target="_blank" rel="noopener noreferrer"
                className="text-zinc-600 hover:text-blue-400 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="mailto:alonesurvivor03@gmail.com"
                className="text-zinc-600 hover:text-blue-400 transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </SmoothScroll>
  );
}
