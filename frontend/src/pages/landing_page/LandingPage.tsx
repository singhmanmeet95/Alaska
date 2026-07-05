import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import {
  ArrowRight, Shield, Users, MapPin, Globe, Lock, Activity,
  MessageSquare, Moon, Sun, Menu, X, Plus, Minus, Sparkles, Zap, Star
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

export default function LandingPage() {
  const [scrollYState, setScrollYState] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, checkAuth, logout } = useAuthStore();
  
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 250]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    setHasMounted(true);
    checkAuth();
    const handleScroll = () => setScrollYState(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      root.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground font-sans transition-all duration-700 overflow-hidden relative ${hasMounted ? "opacity-100" : "opacity-0"}`}>
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-block-lilac/10 dark:bg-block-lilac/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-block-lime/10 dark:bg-block-lime/5 blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-[80px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMTI4LDEyOCwxMjgsMC4xKSIvPjwvc3ZnPg==')] opacity-50 dark:opacity-20" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrollYState > 20 || isMobileMenuOpen ? "bg-background/70 backdrop-blur-xl border-b border-border/50 py-3 shadow-sm" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg"
            >
              <span className="text-primary-foreground font-bold text-xl font-mono">A</span>
            </motion.div>
            <span className="text-2xl font-bold tracking-tighter group-hover:tracking-tight transition-all duration-300">Alaska</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-button text-sm font-medium">
            {isAuthenticated ? (
              <>
                <Link to="/map" className="hover:text-primary transition-colors relative group">
                  Map
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link to="/chat" className="hover:text-primary transition-colors relative group">
                  Chat
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link to="/profile" className="hover:text-primary transition-colors relative group">
                  Profile
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              </>
            ) : (
              <>
                <a href="#how-it-works" className="hover:text-primary transition-colors relative group">
                  How it Works
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
                <a href="#features" className="hover:text-primary transition-colors relative group">
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
                <a href="#testimonials" className="hover:text-primary transition-colors relative group">
                  Testimonials
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4 font-button text-sm">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode} 
              className="w-10 h-10 rounded-full hover:bg-card transition-colors flex items-center justify-center border border-border/50 backdrop-blur-sm shadow-sm"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            
            {isAuthenticated ? (
              <>
                <button onClick={handleLogout} className="text-foreground/70 hover:text-red-500 transition-colors font-medium">Log Out</button>
                <Link to="/profile">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all font-semibold">
                    My Profile
                  </motion.div>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth" className="text-foreground/70 hover:text-primary transition-colors font-medium">Log In</Link>
                <Link to="/auth">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all font-semibold flex items-center gap-2">
                    Get Started <ArrowRight size={16} />
                  </motion.div>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleDarkMode} className="w-10 h-10 rounded-full hover:bg-card flex items-center justify-center border border-border/50 shadow-sm">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-foreground">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 overflow-hidden absolute w-full top-full left-0 shadow-2xl"
            >
              <div className="flex flex-col px-6 py-8 gap-6 font-button text-lg">
                {isAuthenticated ? (
                  <>
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/map" className="hover:text-primary">Map</Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/chat" className="hover:text-primary">Chat</Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/profile" className="hover:text-primary">Profile</Link>
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-left text-red-500">Log Out</button>
                  </>
                ) : (
                  <>
                    <a onClick={() => setIsMobileMenuOpen(false)} href="#how-it-works" className="hover:text-primary">How it Works</a>
                    <a onClick={() => setIsMobileMenuOpen(false)} href="#features" className="hover:text-primary">Features</a>
                    <a onClick={() => setIsMobileMenuOpen(false)} href="#testimonials" className="hover:text-primary">Testimonials</a>
                    <a onClick={() => setIsMobileMenuOpen(false)} href="#faq" className="hover:text-primary">FAQ</a>
                    <div className="h-px w-full bg-border/50 my-2" />
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/auth" className="text-center px-6 py-4 border border-border/50 rounded-2xl hover:bg-card transition-colors">Log In</Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/auth" className="text-center px-6 py-4 bg-primary text-primary-foreground rounded-2xl shadow-lg transition-transform active:scale-95">Get Started</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-[160px] md:pt-[220px] pb-[120px] px-6 z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 min-h-screen">
        <motion.div 
          style={{ y: heroY, opacity: opacityHero }}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex-1 flex flex-col space-y-8"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary font-medium text-sm w-fit shadow-sm backdrop-blur-md">
            <Sparkles size={16} />
            <span>The #1 app for daily commuters</span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="font-display-xl leading-[1.1] text-5xl md:text-6xl lg:text-[84px] tracking-tighter">
            Turn your <span className="text-transparent bg-clip-text bg-gradient-to-r from-block-lilac to-primary">commute</span> into connections.
          </motion.h1>

          <motion.p variants={fadeInUp} className="font-subhead text-foreground/70 max-w-xl text-lg md:text-2xl font-light leading-relaxed">
            Alaska instantly matches you with verified professionals and students on your exact route. Stop travelling alone.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-start gap-5 pt-6 w-full">
            <Link to={isAuthenticated ? "/map" : "/auth"} className="w-full sm:w-auto">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 text-lg font-semibold w-full"
              >
                Find Your Match
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              </motion.div>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-background/50 backdrop-blur-md text-foreground border border-border/80 rounded-full hover:bg-card transition-all w-full text-center flex items-center justify-center gap-2 text-lg font-medium shadow-sm"
              >
                See How It Works
              </motion.div>
            </a>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="pt-10 flex flex-wrap items-center gap-5 text-foreground/70 font-body-sm">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className={`w-12 h-12 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold shadow-md relative`}
                  style={{ zIndex: 10 - i, backgroundColor: `hsl(${i * 60 + 180}, 70%, 80%)`, color: `hsl(${i * 60 + 180}, 80%, 20%)` }}
                >
                  {['SJ', 'MR', 'DL', 'AK'][i-1]}
                </motion.div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-background bg-card flex items-center justify-center text-xs font-bold shadow-md z-0">
                +2k
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex gap-1 text-yellow-500 mb-1">
                {[1, 2, 3, 4, 5].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="font-medium text-sm">Trusted by 15,000+ daily</p>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: easeOutExpo, delay: 0.2 }}
          className="flex-1 w-full relative perspective-[1000px]"
        >
          {/* Floating interactive elements */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -left-6 md:-left-12 top-10 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-border/50 shadow-2xl z-20 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-block-lime flex items-center justify-center text-black font-bold text-xs shadow-inner">MATCH</div>
            <div>
              <p className="font-bold text-sm">Found Sarah J.</p>
              <p className="text-xs text-foreground/60">0.2 miles away • Same route</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute -right-4 md:-right-8 bottom-10 md:bottom-20 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-border/50 shadow-2xl z-20 flex items-center gap-3"
          >
            <Shield className="text-green-500" size={24} />
            <div>
              <p className="font-bold text-sm">Verified User</p>
              <p className="text-xs text-foreground/60">ID & Work Email checked</p>
            </div>
          </motion.div>

          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-border/30 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8, ease: easeOutExpo }}
            >
              <img 
                src="/images/hero_commute.jpg" 
                alt="Two professionals chatting and smiling on a metro train" 
                className="w-full h-auto object-cover aspect-[4/3] md:aspect-square lg:aspect-[4/3]"
                fetchPriority="high"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section with Scroll Animation */}
      <section className="px-6 mb-[140px] relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-7xl mx-auto bg-gradient-to-br from-block-lilac to-[#d5c4f7] border border-white/20 text-black rounded-[40px] p-[40px] md:p-[64px] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 divide-x-0 md:divide-x divide-black/10 relative z-10">
            <StatItem value="15k+" label="Daily Commuters" delay={0.1} />
            <StatItem value="98%" label="Satisfaction" delay={0.2} />
            <StatItem value="120+" label="Metro Stations" delay={0.3} />
            <StatItem value="24/7" label="Safe Support" delay={0.4} />
          </div>
        </motion.div>
      </section>
      
      {/* Problem / Solution Section */}
      <section className="py-[120px] px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display-lg mb-6 leading-tight"
          >
            Commuting shouldn't be lonely.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-body-lg text-foreground/60 max-w-3xl mx-auto text-xl leading-relaxed"
          >
            The average urban professional spends over 200 hours a year commuting. That's time often wasted in isolation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <ProblemCard title="Missed Opportunities" desc="Networking and connection opportunities pass by every single day on your route." />
            <ProblemCard title="Safety Concerns" desc="Feeling unsafe traveling alone during late hours or through unfamiliar areas." />
            <ProblemCard title="Wasted Potential" desc="Boredom and unproductive scrolling instead of meaningful conversations." />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50, rotate: 2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-block-lime to-block-lilac blur-3xl opacity-20 dark:opacity-10 rounded-full" />
            <div className="bg-card/80 backdrop-blur-2xl border border-border/50 p-8 md:p-12 rounded-[40px] shadow-2xl relative z-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                <Zap className="text-primary w-8 h-8" />
              </div>
              <h3 className="font-display-lg text-4xl mb-6">The Alaska Solution</h3>
              <p className="font-body text-foreground/70 mb-12 text-lg leading-relaxed">We turn your predictable route into a matching algorithm. Sit next to potential friends, co-founders, or mentors.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 md:p-8 bg-background rounded-3xl border border-border/50 shadow-inner relative overflow-hidden">
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-20 h-20 bg-primary text-primary-foreground rounded-2xl flex flex-col items-center justify-center font-bold shadow-lg z-10">
                  <span className="text-xl">You</span>
                </motion.div>
                
                <div className="flex-1 w-full h-2 relative flex items-center justify-center z-0 my-4 sm:my-0">
                  <div className="absolute inset-0 bg-border overflow-hidden rounded-full">
                    <motion.div 
                      className="h-full bg-primary" 
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bg-background border border-primary text-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-widest z-10 shadow-lg"
                  >
                    MATCH
                  </motion.div>
                </div>

                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }} className="w-20 h-20 bg-block-lime text-black rounded-2xl flex flex-col items-center justify-center font-bold shadow-lg z-10">
                  <span className="text-xl">Them</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-[120px] px-6 relative z-10 w-full max-w-7xl mx-auto border-t border-border/50">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Process</span>
            <h2 className="font-display-lg text-foreground mb-6">How It Works</h2>
            <p className="font-subhead text-foreground/60 max-w-2xl mx-auto">
              Three simple steps to revolutionize your daily travel experience.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <StepCard
            number="01"
            title="Set Your Route"
            description="Enter your start and end points via our interactive map or station list."
            color="bg-blue-500/10 text-blue-500 border-blue-500/20"
          />
          <StepCard
            number="02"
            title="Get Matched"
            description="Our AI finds the most compatible travel partners based on timing and profile."
            color="bg-purple-500/10 text-purple-500 border-purple-500/20"
          />
          <StepCard
            number="03"
            title="Travel Together"
            description="Coordinate via secure chat and meet at the station for a better journey."
            color="bg-green-500/10 text-green-500 border-green-500/20"
          />
        </motion.div>
      </section>

      {/* Features Block */}
      <section id="features" className="px-6 mb-[140px] relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-7xl mx-auto bg-card border border-border/50 rounded-[40px] p-[40px] md:p-[80px] shadow-2xl relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-block-lime/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="mb-20 max-w-2xl relative z-10">
            <h2 className="font-display-lg text-foreground mb-6">Why Choose Alaska?</h2>
            <p className="font-subhead text-foreground/60 text-xl leading-relaxed">Built for safety, designed for connection.</p>
          </div>

          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            <FeatureCard icon={<Activity />} title="Instant Matching" description="Our algorithms find you the perfect travel companion in seconds." />
            <FeatureCard icon={<Shield />} title="Verified Profiles" description="Every profile is verified to ensure a secure community environment." />
            <FeatureCard icon={<MapPin />} title="Live Tracking" description="Real-time location sharing ensures you never miss a meeting." />
            <FeatureCard icon={<Users />} title="Community" description="Join a network of commuters turning travel into meaningful connections." />
            <FeatureCard icon={<Lock />} title="Private & Secure" description="Your data is encrypted end-to-end. We prioritize your privacy." />
            <FeatureCard icon={<Globe />} title="City Wide" description="Wherever the metro goes, Alaska goes. Covering all major lines." />
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-[120px] px-6 max-w-7xl mx-auto border-t border-border/50 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display-lg text-foreground mb-4"
          >
            What Users Say
          </motion.h2>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <TestimonialCard quote="I used to hate my hour-long commute. Now I actually look forward to it. Met amazing people!" author="Sarah J." role="Software Engineer" color="bg-blue-500/20" />
          <TestimonialCard quote="Safety was my biggest concern. The verification process on Alaska gave me total peace of mind." author="Michael R." role="Student" color="bg-green-500/20" />
          <TestimonialCard quote="Found a co-founder for my startup on a train ride. This app is a networking goldmine." author="David L." role="Entrepreneur" color="bg-purple-500/20" />
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-[120px] px-6 max-w-3xl mx-auto border-t border-border/50 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="text-center mb-16">
            <h2 className="font-display-lg mb-6 text-4xl md:text-5xl">Questions?</h2>
            <p className="text-foreground/60 text-lg">Everything you need to know about the product.</p>
          </div>
          <div className="space-y-4">
            <FAQItem question="Is Alaska safe to use?" answer="Absolutely. Every user must verify their identity using a valid ID or university/work email before they can start matching. We also provide live location sharing during active journeys and a 24/7 report system." />
            <FAQItem question="Is the app free?" answer="Yes! Core matching and chat features are completely free. We believe safe commutes should be accessible to everyone." />
            <FAQItem question="What if I don't want to talk?" answer="That's perfectly fine. You can set your commute preference to 'Quiet Ride' in your profile, letting others know you just want a safe companion without the small talk." />
            <FAQItem question="How does the matching work?" answer="We use your selected start station, end station, and departure time to find commuters on the exact same route. Our algorithm also factors in mutual interests and past positive reviews." />
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-6 mb-[120px] relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-7xl mx-auto bg-foreground text-background rounded-[40px] p-[60px] md:p-[100px] text-center flex flex-col items-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-primary/20" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary rounded-full blur-[120px] opacity-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-block-lime rounded-full blur-[120px] opacity-10" />
          
          <div className="relative z-10 flex flex-col items-center w-full">
            <h2 className="font-display-xl mb-8 text-5xl md:text-7xl">Ready to ride?</h2>
            <p className="font-subhead text-background/80 max-w-2xl mb-12 text-xl md:text-2xl leading-relaxed">
              Join thousands of others who matched today. Safe, fast, and completely free.
            </p>
            <Link to="/auth">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-background text-foreground font-button text-xl font-bold rounded-full hover:shadow-2xl hover:shadow-background/30 transition-all flex items-center gap-3"
              >
                Create Free Account
                <ArrowRight size={24} />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-8 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                <span className="text-primary-foreground font-bold text-lg font-mono">A</span>
              </div>
              <span className="text-2xl font-bold font-sans tracking-tight">Alaska</span>
            </div>
            <p className="text-foreground/60 text-lg max-w-sm leading-relaxed">
              Making urban travel social, safe, and productive. One match at a time.
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-7">
            <h4 className="font-bold mb-6 font-eyebrow text-foreground">Product</h4>
            <ul className="space-y-4 text-foreground/60 font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Safety</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Mobile App</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold mb-6 font-eyebrow text-foreground">Company</h4>
            <ul className="space-y-4 text-foreground/60 font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold mb-6 font-eyebrow text-foreground">Legal</h4>
            <ul className="space-y-4 text-foreground/60 font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs text-foreground/40 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Alaska Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Designed in the real world</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Subcomponents

function ProblemCard({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex gap-6 items-start group">
      <div className="mt-1 w-14 h-14 rounded-2xl bg-card border border-border/50 text-foreground/50 flex items-center justify-center shrink-0 font-bold group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all shadow-sm">
        <X size={24} />
      </div>
      <div>
        <h3 className="font-headline text-2xl mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-foreground/60 text-lg leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
      whileHover={{ y: -5, scale: 1.02 }}
      className="group p-8 md:p-10 rounded-3xl bg-background border border-border/50 hover:border-primary/30 transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="mb-8 w-16 h-16 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
        {icon}
      </div>
      <h3 className="font-headline text-2xl mb-4 relative z-10">{title}</h3>
      <p className="font-body-sm text-foreground/60 text-lg leading-relaxed relative z-10">
        {description}
      </p>
    </motion.div>
  );
}

function StatItem({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className="text-center md:text-left px-4"
    >
      <h3 className="font-display-xl text-black mb-4 leading-none text-5xl md:text-7xl font-bold tracking-tighter">{value}</h3>
      <p className="font-eyebrow text-black/70 text-sm md:text-base font-bold uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description, color }: { number: string; title: string; description: string; color: string }) {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} 
      whileHover={{ y: -10 }}
      className="relative group p-10 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 opacity-20 ${color.split(' ')[0]}`} />
      <div className={`w-16 h-16 rounded-2xl border ${color} flex items-center justify-center font-bold text-2xl mb-8 group-hover:scale-110 transition-transform`}>
        {number}
      </div>
      <h3 className="font-headline text-2xl mb-4 relative z-10">{title}</h3>
      <p className="font-body-sm text-foreground/60 text-lg leading-relaxed relative z-10">{description}</p>
    </motion.div>
  );
}

function TestimonialCard({ quote, author, role, color }: { quote: string; author: string; role: string; color: string }) {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -10 }}
      className="p-10 rounded-3xl bg-card border border-border/50 flex flex-col justify-between h-full shadow-sm hover:shadow-xl transition-all relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-48 h-48 ${color} rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 opacity-60`} />
      <div className="relative z-10">
        <div className="mb-8 text-primary">
          <MessageSquare size={40} className="opacity-40" />
        </div>
        <p className="font-body text-xl text-foreground mb-12 leading-relaxed font-light italic">
          "{quote}"
        </p>
      </div>
      <div className="flex items-center gap-5 relative z-10">
        <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-md">
          {author.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold font-sans text-lg">{author}</h4>
          <p className="font-body-sm text-foreground/60">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      initial={false}
      className="border border-border/50 rounded-3xl bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="font-headline text-foreground text-xl group-hover:text-primary transition-colors pr-8">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0 border border-border/50 group-hover:border-primary/50 transition-colors">
          {isOpen ? <Minus size={20} className="text-foreground/70" /> : <Plus size={20} className="text-foreground/70" />}
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-8 pb-8 text-foreground/60 font-body text-lg leading-relaxed border-t border-border/50 pt-6 mt-2">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
