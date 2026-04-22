"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Rocket, Mail, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { authApi } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { useApp } from "@/context/AppContext";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation côté client (même règles que le backend)
    if (name.length < 3) {
      setError("Le nom d'utilisateur doit faire au moins 3 caractères.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (!/(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError("Le mot de passe doit contenir au moins une majuscule et un chiffre.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await authApi.register({ username: name, email, password });

      // Stocker le token et les infos utilisateur
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      
      setUser(data.user);

      router.push("/dashboard");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col relative overflow-hidden">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6 pt-24 md:pt-32">

      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[size:40px_40px] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]" />
      
      {/* Decorative blurs */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-secondary/10 blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/10 blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg relative z-10 mt-12 md:mt-0"
      >
        <div className="text-center mb-6 md:mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 md:mb-6 group">
            <div className="bg-secondary p-2 rounded-none transition-transform group-hover:scale-110">
              <Rocket className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="font-black text-xl md:text-2xl tracking-tighter text-text-main uppercase">
              Focus<span className="text-primary italic">Polytech</span>
            </span>
          </Link>
          <h1 className="text-2xl md:text-4xl font-light text-text-main leading-none uppercase tracking-tighter">
            Rejoignez <span className="font-black">l&apos;élite</span>
          </h1>
        </div>

        <Card className="p-6 md:p-10 border-t-8 border-t-secondary bg-bg-alt/60 backdrop-blur-xl shadow-2xl border-x-white/5 border-b-white/5">
          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary block mb-2">Nom Complet</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-bg-main border border-white/10 p-4 pl-12 rounded-xl focus:border-secondary outline-none font-bold text-text-main transition-all"
                    placeholder="Jean Dupont"
                    autoComplete="name"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary block mb-2">Adresse Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-bg-main border border-white/10 p-4 pl-12 rounded-xl focus:border-secondary outline-none font-bold text-text-main transition-all"
                    placeholder="etudiant@polytech.cm"
                    autoComplete="username"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary block mb-2">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-bg-main border border-white/10 p-4 pl-12 rounded-xl focus:border-secondary outline-none font-bold text-text-main transition-all"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-secondary/5 border border-secondary/10 flex gap-3">
              <ShieldCheck className="text-secondary shrink-0" size={18} />
              <p className="text-[9px] font-bold text-secondary uppercase leading-tight">
                En vous inscrivant, vous acceptez de relever les défis de productivité de l&apos;ENSPY.
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-16 text-lg flex items-center justify-center gap-3 group bg-secondary hover:bg-secondary/90"
            >
              {isLoading ? "Création en cours..." : "Créer mon compte"}
              {!isLoading && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
            </Button>

            <div className="text-center pt-4">
              <p className="text-xs text-text-secondary uppercase font-bold tracking-widest">
                Déjà membre ? <br />
                <Link href="/auth/login" className="text-secondary hover:underline mt-2 inline-block">Se connecter à l&apos;espace focus</Link>
              </p>
            </div>
          </form>
        </Card>
      </motion.div>
      </div>
    </div>
  );
}
