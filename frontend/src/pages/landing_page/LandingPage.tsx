import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import {
  ArrowRight,
  Shield,
  Users,
  MapPin,
  Globe,
  Lock,
  Activity,
  MessageSquare,
} from "lucide-react";

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const { isAuthenticated, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    setHasMounted(true);
    checkAuth(); // Update store with current token if any

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <div
      className={`min-h-screen bg-black text-zinc-300 font-sans selection:bg-orange-600 selection:text-white overflow-hidden relative ${hasMounted ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}
    >
      {/* Background Gradient Blurs - Orange & Black Theme */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-800/20 rounded-full blur-[120px] animate-pulse-slow delay-700"></div>
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-orange-900/5 rounded-full blur-[100px] animate-pulse-slow delay-500"></div>
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrollY > 20
            ? "bg-black/80 backdrop-blur-md border-b border-zinc-800"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-600/20">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Alaska
            </span>
          </div>

          <div className="flex items-center gap-8 hidden md:flex">
            {isAuthenticated ? (
              <>
                <Link
                  to="/map"
                  className="text-sm font-medium text-zinc-400 hover:text-orange-500 transition-colors"
                >
                  Map
                </Link>
                <Link
                  to="/chat"
                  className="text-sm font-medium text-zinc-400 hover:text-orange-500 transition-colors"
                >
                  Chat
                </Link>
                <Link
                  to="/profile"
                  className="text-sm font-medium text-zinc-400 hover:text-orange-500 transition-colors"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <a
                  href="#how-it-works"
                  className="text-sm font-medium text-zinc-400 hover:text-orange-500 transition-colors"
                >
                  How it Works
                </a>
                <a
                  href="#features"
                  className="text-sm font-medium text-zinc-400 hover:text-orange-500 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="text-sm font-medium text-zinc-400 hover:text-orange-500 transition-colors"
                >
                  Testimonials
                </a>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium hover:text-orange-500 transition-colors hidden sm:block"
                >
                  Log Out
                </button>
                <Link
                  to="/profile"
                  className="px-5 py-2.5 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-all duration-300 shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transform hover:-translate-y-0.5"
                >
                  My Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-sm font-medium hover:text-orange-500 transition-colors hidden sm:block"
                >
                  Log In
                </Link>
                <Link
                  to="/auth"
                  className="px-5 py-2.5 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-all duration-300 shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 px-6 z-10 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-8 animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[1.1] animate-fade-in-up delay-100">
            Commute <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-600 to-orange-800">
              Smarter.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Stop travelling alone. Alaska connects you with professionals and
            students on your route. Safe, verified, and efficient.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 animate-fade-in-up delay-300">
            <Link
              to={isAuthenticated ? "/map" : "/auth"}
              className="px-8 py-4 bg-orange-600 text-white font-bold rounded-xl text-lg hover:bg-orange-700 transition-all duration-300 shadow-[0_4px_20px_rgba(234,88,12,0.4)] flex items-center gap-2 group hover:scale-105"
            >
              Start Matching
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-zinc-900 text-zinc-300 font-semibold rounded-xl text-lg border border-zinc-800 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition-all duration-300"
            >
              Learn More
            </a>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-20 w-full max-w-4xl border-t border-zinc-900 mt-12 animate-fade-in delay-500">
            <StatItem value="15k+" label="Daily Commuters" delay="delay-100" />
            <StatItem value="98%" label="Satisfaction" delay="delay-200" />
            <StatItem value="120+" label="Metro Stations" delay="delay-300" />
            <StatItem value="24/7" label="Safe Support" delay="delay-500" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-24 px-6 bg-zinc-900/20 relative z-10 w-full"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Three simple steps to revolutionize your daily travel experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepCard
              number="01"
              title="Set Your Route"
              description="Enter your start and end points via our interactive map or station list."
            />
            <StepCard
              number="02"
              title="Get Matched"
              description="Our AI finds the most compatible travel partners based on timing and profile."
            />
            <StepCard
              number="03"
              title="Travel Together"
              description="Coordinate via secure chat and meet at the station for a better journey."
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="py-32 px-6 relative z-10 max-w-7xl mx-auto"
      >
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-6">
            Why Choose Alaska?
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Built for safety, designed for connection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Activity className="w-6 h-6 text-orange-500" />}
            title="Instant Matching"
            description="Our advanced algorithms find you the perfect travel companion in seconds based on route and interests."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-orange-500" />}
            title="Verified Profiles"
            description="Safety first. Every profile is verified to ensure a secure and trusted community environment."
          />
          <FeatureCard
            icon={<MapPin className="w-6 h-6 text-orange-500" />}
            title="Live Tracking"
            description="Real-time location sharing ensures you never miss meeting your companion."
          />
          <FeatureCard
            icon={<Users className="w-6 h-6 text-orange-500" />}
            title="Community"
            description="Join a growing network of commuters turning boring travel time into meaningful connections."
          />
          <FeatureCard
            icon={<Lock className="w-6 h-6 text-orange-500" />}
            title="Private & Secure"
            description="Your data is encrypted end-to-end. We prioritize your privacy above all else."
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6 text-orange-500" />}
            title="City Wide"
            description="Wherever the metro goes, Alaska goes. Covering all major lines and stations."
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-24 px-6 bg-zinc-900/30 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              What Users Say
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Don't just take our word for it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="I used to hate my hour-long commute. Now I actually look forward to it. Met amazing people!"
              author="Sarah J."
              role="Software Engineer"
            />
            <TestimonialCard
              quote="Safety was my biggest concern. The verification process on Alaska gave me total peace of mind."
              author="Michael R."
              role="Student"
            />
            <TestimonialCard
              quote="Found a co-founder for my startup on a train ride. This app is a networking goldmine."
              author="David L."
              role="Entrepreneur"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 hover:border-orange-900/50 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden group transition-all duration-500 shadow-2xl shadow-black/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to ride?
            </h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Join thousands of others who matched today. Safe, fast, and
              completely free.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/auth"
                className="inline-block px-10 py-4 bg-white text-black font-bold rounded-xl text-lg hover:bg-orange-50 transition-colors duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <span className="text-lg font-bold text-white">Alaska</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Making urban travel social, safe, and productive. One match at a
              time.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Safety
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Mobile App
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} Alaska Inc. All rights reserved.
          </p>
          <div className="flex gap-4">{/* Social icons can go here */}</div>
        </div>
      </footer>
    </div>
  );
}

// Components

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900/60 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1">
      <div className="w-12 h-12 bg-zinc-800/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 group-hover:text-orange-500 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-500 transition-colors">
        {title}
      </h3>
      <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
        {description}
      </p>
    </div>
  );
}

function StatItem({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay?: string;
}) {
  return (
    <div className={`text-center ${delay} animate-fade-in`}>
      <h3 className="text-3xl md:text-4xl font-bold text-white mb-1 hover:text-orange-500 transition-colors cursor-default">
        {value}
      </h3>
      <p className="text-zinc-600 text-sm font-medium uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative p-6 group">
      <div className="text-6xl font-bold text-zinc-900 absolute -top-4 -left-4 z-0 group-hover:text-orange-900/20 transition-colors select-none">
        {number}
      </div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-500 transition-colors">
          {title}
        </h3>
        <p className="text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800/30 relative">
      <div className="absolute top-6 left-6 text-orange-600 opacity-20">
        <MessageSquare size={40} />
      </div>
      <p className="text-zinc-300 mb-6 italic relative z-10 leading-relaxed">
        "{quote}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-sm">
          {author.charAt(0)}
        </div>
        <div>
          <h4 className="text-white font-bold text-sm">{author}</h4>
          <p className="text-zinc-500 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}
