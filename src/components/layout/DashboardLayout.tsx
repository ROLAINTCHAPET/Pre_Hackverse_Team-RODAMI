"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  LayoutDashboard, 
  Timer, 
  CheckSquare, 
  BarChart3, 
  User as UserIcon,
  LogOut,
  Rocket,
  ArrowLeft,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Focus Timer", href: "/dashboard/focus", icon: Timer },
  { name: "Mes Tâches", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Statistiques", href: "/dashboard/stats", icon: BarChart3 },
  { name: "Mon Profil", href: "/dashboard/profile", icon: UserIcon },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { stats } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Étudiant");
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const userDataString = localStorage.getItem('user_data');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        const name = userData.username || userData.name || "Étudiant";
        Promise.resolve().then(() => setUserName(name));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    router.push("/");
  };

  const nextLevelXp = stats.level * 1000;
  const xpPercentage = (stats.xp / nextLevelXp) * 100;
  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  if (!isMounted) return <div className="min-h-screen bg-bg-main" />;

  return (
    <div className="flex h-screen bg-bg-main overflow-hidden text-text-main">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar — Desktop: always visible, Mobile: slide-in */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-bg-alt border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-primary p-1.5 rounded-none">
              <Rocket className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-text-main">
              Focus<span className="text-primary italic">Polytech</span>
            </span>
          </Link>
          {/* Close button on mobile */}
          <button 
            className="lg:hidden text-text-secondary hover:text-text-main transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-text-secondary hover:bg-white/5 hover:text-text-main"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-text-secondary group-hover:text-primary")} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-danger hover:bg-danger/10 transition-all rounded-none"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-bg-main/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all shadow-lg border border-white/10"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {pathname !== '/dashboard' && (
              <button 
                className="group flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-main transition-all rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 shadow-inner"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span className="hidden sm:inline">Retour</span>
              </button>
            )}
            <h2 className="text-sm sm:text-lg font-bold text-text-main uppercase tracking-widest border-l-4 border-primary pl-3 sm:pl-4 truncate">
              {sidebarLinks.find(l => l.href === pathname)?.name || "Tableau de bord"}
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden md:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-tighter text-text-secondary">Niveau {stats.level}</span>
                <span className="text-[10px] font-bold text-primary">{stats.xp} / {nextLevelXp} XP</span>
              </div>
              <div className="w-48 h-1.5 bg-white/5 rounded-none border border-white/10 overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000" 
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>
            
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-bg-alt border border-white/10 flex items-center justify-center font-bold text-primary rounded-none shadow-inner text-sm sm:text-base">
              {initials}
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[size:40px_40px] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]" />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
