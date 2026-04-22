"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Menu, X, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Focus Timer", href: "/dashboard/focus" },
  { name: "Classement", href: "/dashboard/stats" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "bg-bg-main/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl" 
          : "bg-transparent py-8"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-none transition-transform group-hover:scale-110 shadow-lg shadow-primary/20">
            <Rocket className="text-white w-5 h-5" />
          </div>
          <span className="font-black text-xl md:text-2xl tracking-tighter text-text-main uppercase italic">
            Focus<span className="text-primary italic">Polytech</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[10px] font-black text-white hover:text-white/70 uppercase tracking-widest transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-6 border-l border-white/10 pl-8">
            <Link href="/auth/login">
              <Button variant="tertiary" className="text-[10px] font-black uppercase tracking-widest text-white hover:text-white/70">Se connecter</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="text-[10px] font-black uppercase tracking-widest px-6 h-10 bg-white text-primary hover:bg-white/90">S&apos;inscrire</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-3 text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all shadow-xl z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-bg-alt/95 backdrop-blur-2xl border-b border-white/5 p-8 absolute top-full left-0 w-full flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[10px] font-black text-text-main hover:text-primary uppercase tracking-[0.2em]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-white/5" />
          <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="secondary" className="w-full h-12 text-[10px] font-black uppercase tracking-widest border-white/5">Se connecter</Button>
          </Link>
          <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full h-12 text-[10px] font-black uppercase tracking-widest bg-primary text-white">S&apos;inscrire</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};
