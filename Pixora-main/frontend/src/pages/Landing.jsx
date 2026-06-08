import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRight, Shield, Zap, Globe, Cloud, 
  Lock, Share2, History, MousePointer2, Clock 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const subheadlineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Text Reveal - Smoother animation
      if (headlineRef.current) {
        const chars = headlineRef.current.innerText.split('');
        headlineRef.current.innerHTML = chars
          .map(char => `<span class="text-reveal-char">${char === ' ' ? '&nbsp;' : char}</span>`)
          .join('');

        gsap.from('.text-reveal-char', {
          opacity: 0,
          y: 40,
          rotationX: -90,
          transformOrigin: '0% 50% -50',
          stagger: 0.02,
          duration: 1,
          ease: "back.out(1.5)",
          delay: 0.3
        });
      }

      // Subheadline Fade
      gsap.from(subheadlineRef.current, {
        opacity: 0,
        y: 30,
        duration: 1.2,
        delay: 0.8,
        ease: "power3.out"
      });

      // Section Reveals
      gsap.utils.toArray('.reveal-section').forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          opacity: 0,
          y: 60,
          duration: 1.2,
          ease: "power3.out"
        });
      });

      // Stats Counting - Smoother animation with better reveal
      gsap.utils.toArray('.stat-container').forEach((container, index) => {
        const number = container.querySelector('.stat-number');
        const suffix = container.querySelector('.stat-suffix');
        const label = container.querySelector('.stat-label');
        const target = parseInt(number.getAttribute('data-target'));

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });

        // Animate number with scale and opacity
        tl.fromTo(number, 
          { 
            opacity: 0, 
            scale: 0.5,
            y: 30
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(2)",
            delay: index * 0.1
          }
        );

        // Count up animation
        tl.to(number, {
          innerText: target,
          duration: 2,
          snap: { innerHTML: 1 },
          ease: "power2.out",
          onUpdate: function() {
            number.innerText = Math.ceil(number.innerText);
          }
        }, "-=0.5");

        // Animate suffix
        tl.fromTo(suffix,
          {
            opacity: 0,
            x: -10
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out"
          },
          "-=1.5"
        );

        // Animate label
        tl.fromTo(label,
          {
            opacity: 0,
            y: 10
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
          },
          "-=1.3"
        );
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="bg-black selection:bg-accent selection:text-white">
      
      {/* Section 1: Hero */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(var(--accent) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <h1 
            ref={headlineRef}
            className="text-6xl md:text-[120px] font-display font-extrabold leading-[0.9] tracking-tighter mb-8"
          >
            Your Files. Anywhere.
          </h1>
          <p 
            ref={subheadlineRef}
            className="text-lg md:text-2xl text-muted font-body max-w-2xl mx-auto mb-12"
          >
            Upload once. Share forever. Access from any device on earth.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link
              to="/register"
              className="group bg-accent hover:bg-accent-dark text-white px-10 py-5 btn-sharp font-bold text-lg uppercase tracking-widest transition-all duration-500 electric-glow-strong flex items-center gap-3"
            >
              Start Converting <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Floating cards */}
        <div className="absolute bottom-20 left-10 md:left-40 hidden lg:block">
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-48 h-64 bg-surface-2 border border-white/10 btn-sharp overflow-hidden flex flex-col justify-between electric-glow"
          >
            <img 
              src="https://static.vecteezy.com/system/resources/previews/005/843/778/non_2x/abstract-technology-concept-internet-futuristic-network-connection-human-communication-with-world-map-circle-future-technology-digital-on-hi-tech-dark-blue-background-illustration-vector.jpg"
              alt="Cloud Technology"
              className="w-full h-full object-cover opacity-80"
            />
          </motion.div>
        </div>

        <div className="absolute top-40 right-10 md:right-40 hidden lg:block">
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="w-40 h-56 bg-surface-2 border border-white/10 btn-sharp overflow-hidden"
          >
            <img 
              src="https://t4.ftcdn.net/jpg/03/82/68/65/360_F_382686575_B4WT0NbXfzhQU5KnMaTHWZPkH2vTW7fY.jpg"
              alt="File Sharing"
              className="w-full h-full object-cover opacity-70"
            />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
            <motion.div 
              animate={{ y: [-48, 48] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-full bg-accent"
            />
          </div>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section id="services" className="py-32 px-6 bg-surface-1 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="reveal-section mb-24">
            <h2 className="text-4xl md:text-7xl font-display tracking-tighter mb-6 uppercase">How It Works</h2>
            <div className="w-24 h-[1px] bg-accent" />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { num: '01', icon: <Cloud />, title: 'Upload', desc: 'Drag your JPEG, PNG, or PDF files into our secure workspace.' },
              { num: '02', icon: <Lock />, title: 'Convert', desc: 'We store your assets in a cinematic dark cloud with JWT security.' },
              { num: '03', icon: <Share2 />, title: 'Share', desc: 'Get a permanent universal link that works on any device globally.' }
            ].map((step, i) => (
              <div key={i} className="reveal-section group">
                <span className="block text-6xl font-display font-extrabold text-accent opacity-20 group-hover:opacity-100 transition-opacity duration-500 mb-6">{step.num}</span>
                <div className="w-16 h-16 bg-surface-2 border border-white/10 flex items-center justify-center mb-8 btn-sharp text-accent group-hover:border-accent transition-colors">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-display font-bold uppercase mb-4 tracking-wider">{step.title}</h3>
                <p className="text-muted leading-relaxed font-body">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: About Us */}
      <section id="about" className="py-32 px-6 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="reveal-section">
            <h2 className="text-4xl md:text-6xl font-display tracking-tighter mb-10 uppercase leading-none">
              Built for creators, developers, and teams
            </h2>
            <p className="text-xl text-muted font-body leading-relaxed mb-12 max-w-xl">
              Pixora was engineered to solve a single problem: file accessibility. 
              We provide a permanent, cinematic platform for hosting your assets 
              with zero friction and absolute security.
            </p>
            
            <div className="grid grid-cols-2 gap-10 border-t border-white/5 pt-12">
              {[
                { label: 'Files Hosted', target: 10000, suffix: '+' },
                { label: 'Uptime Status', target: 99, suffix: '.9%' },
                { label: 'File Types', target: 3, suffix: ' Core' },
                { label: 'Instant Links', target: 100, suffix: '%' }
              ].map((stat, i) => (
                <div key={i} className="stat-container">
                  <div className="text-3xl md:text-5xl font-display font-extrabold text-white mb-1 flex items-baseline overflow-hidden">
                    <span className="stat-number inline-block" data-target={stat.target}>0</span>
                    <span className="stat-suffix inline-block">{stat.suffix}</span>
                  </div>
                  <span className="stat-label block text-xs uppercase tracking-widest text-muted font-bold opacity-0">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-section relative">
            <div className="aspect-square bg-surface-2 border border-white/10 btn-sharp relative overflow-hidden group">
              <img 
                src="https://www.iis.fraunhofer.de/en/ff/kom/ai/embedded-ai/jcr:content/stage/stageParsys/stage_slide_copy/image.img.jpg/1756726062940/Embedded-AI.jpg"
                alt="Technology Innovation"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 group-hover:scale-105 transform"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-black/60 mix-blend-overlay" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Features */}
      <section id="services" className="py-32 px-6 bg-surface-1">
        <div className="max-w-7xl mx-auto">
          <div className="reveal-section text-center mb-24">
            <h2 className="text-4xl md:text-7xl font-display tracking-tighter uppercase mb-6">Engineered Excellence</h2>
            <p className="text-muted font-body max-w-xl mx-auto italic">Every feature crafted for speed and security.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <MousePointer2 />, title: 'Drag & Drop', desc: 'Seamlessly upload assets with our high-end interface.' },
              { icon: <Globe />, title: 'Public URLs', desc: 'Unique IDs (nanoid) for permanent, globally accessible links.' },
              { icon: <Zap />, title: 'PDF Preview', desc: 'Instant rendering of documents on any browser.' },
              { icon: <History />, title: 'Asset History', desc: 'Complete dashboard to manage and track your hosted files.' },
              { icon: <Clock />, title: 'Expiry Control', desc: 'Set link durations or keep them alive forever.' },
              { icon: <Lock />, title: 'JWT Secured', desc: 'Bank-grade authentication protecting every upload.' }
            ].map((feat, i) => (
              <div key={i} className="reveal-section group p-10 bg-black border border-white/5 btn-sharp hover:border-accent transition-all duration-500 hover:scale-[1.02] hover:electric-glow">
                <div className="text-accent mb-6 group-hover:scale-110 transition-transform duration-500">{feat.icon}</div>
                <h4 className="text-xl font-display font-bold uppercase mb-4 tracking-widest">{feat.title}</h4>
                <p className="text-muted text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: CTA Banner */}
      <section className="py-24 bg-black border-y border-accent/20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase mb-10">
            Ready to make your files universal?
          </h2>
          <Link
            to="/register"
            className="inline-block bg-accent hover:bg-accent-dark text-white px-12 py-6 btn-sharp font-extrabold text-xl uppercase tracking-[0.2em] transition-all duration-500 electric-glow-strong"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Section 6: Contact */}
      <section id="contact" className="py-32 px-6 bg-surface-1">
        <div className="max-w-xl mx-auto text-center reveal-section">
          <h2 className="text-3xl md:text-5xl font-display tracking-tighter uppercase mb-8">Get In Touch</h2>
          <p className="text-xl font-body text-accent font-bold mb-12 hover:underline cursor-pointer">hello@pixora.io</p>
          <div className="flex justify-center gap-10">
            <Globe className="text-muted hover:text-white transition-colors cursor-pointer" size={24} />
            <Share2 className="text-muted hover:text-white transition-colors cursor-pointer" size={24} />
            <Cloud className="text-muted hover:text-white transition-colors cursor-pointer" size={24} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-12 bg-black border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="text-xl font-display font-bold tracking-tighter uppercase">Pixora</span>
        <span className="text-[10px] uppercase tracking-widest text-muted font-bold">© 2026 Pixora. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default Landing;
