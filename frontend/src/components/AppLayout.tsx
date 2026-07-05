import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Map, MessageCircle, User, Home } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/map", icon: Map, label: "Map" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function AppLayout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();

  // Hide dock on Auth pages or if we want specific full-screen pages
  const isFullScreenPage = location.pathname.startsWith("/map") || location.pathname.startsWith("/chat");
  const hideDock = location.pathname.startsWith("/auth") || isFullScreenPage;

  return (
    <div className="relative h-[100dvh] w-full bg-background font-sans text-foreground flex flex-col overflow-hidden">
      {/* Main Content Area */}
      <main className={`flex-1 w-full overflow-y-auto overflow-x-hidden relative ${!isFullScreenPage ? "pb-[80px]" : ""}`}>
        {children || <Outlet />}
      </main>

      {/* Global Dock Navigation */}
      {!hideDock && (
        <div className="fixed bottom-6 inset-x-0 z-[999] flex justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <Dock direction="middle" className="bg-background/80 backdrop-blur-md border border-border shadow-lg">
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
            </Dock>
          </div>
        </div>
      )}
    </div>
  );
}
