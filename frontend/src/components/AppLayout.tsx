import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Map, MessageCircle, User, Home, Moon, Sun } from "lucide-react";

const navItems = [
  { href: "/map", icon: Map, label: "Map" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
  { href: "/", icon: Home, label: "Home" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function AppLayout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

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

  // Hide dock on Auth pages or if we want specific full-screen pages
  const isFullScreenPage = location.pathname.startsWith("/map") || location.pathname.startsWith("/chat");
  const hideDock = location.pathname.startsWith("/auth");

  return (
    <div className="relative h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden transition-colors duration-500">
      {/* Main Content Area */}
      <main className={`flex-1 w-full overflow-y-auto overflow-x-hidden relative ${!isFullScreenPage ? "pb-[80px]" : ""}`}>
        {children || <Outlet />}
      </main>

      {/* Global Dock Navigation */}
      {!hideDock && (
        <div className="fixed inset-0 z-[999] pointer-events-none flex items-end justify-center pb-6">
          <motion.div 
            drag 
            dragMomentum={false}
            className="pointer-events-auto cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
          >
            <Dock direction="middle" className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
                return (
                  <DockIcon key={item.href}>
                    <Link
                      to={item.href}
                      className={`flex h-full w-full items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-2 ${
                        isActive ? "text-primary bg-primary/10" : "text-foreground/60 hover:text-primary hover:bg-foreground/5"
                      }`}
                      aria-label={item.label}
                    >
                      <item.icon className="h-5 w-5" />
                    </Link>
                  </DockIcon>
                );
              })}
              <DockIcon>
                <button
                  onClick={toggleDarkMode}
                  className="flex h-full w-full items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-2 text-foreground/60 hover:text-primary hover:bg-foreground/5"
                  aria-label="Toggle Dark Mode"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </DockIcon>
            </Dock>
          </motion.div>
        </div>
      )}
    </div>
  );
}
