"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/context/AppContext";

type TimerMode = 'POMODORO' | 'SHORT_BREAK' | 'LONG_BREAK';

const MODES: Record<TimerMode, { label: string; minutes: number; color: string }> = {
  POMODORO: { label: "Focus", minutes: 25, color: "text-primary" },
  SHORT_BREAK: { label: "Pause Courte", minutes: 5, color: "text-secondary" },
  LONG_BREAK: { label: "Pause Longue", minutes: 15, color: "text-secondary" },
};

export const FocusTimer = () => {
  const { completeSession, getSortedTasks } = useApp();
  const [mode, setMode] = useState<TimerMode>('POMODORO');
  const [timeLeft, setTimeLeft] = useState(MODES.POMODORO.minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const resetTimer = useCallback((newMode?: TimerMode) => {
    const targetMode = newMode || mode;
    setIsActive(false);
    setMode(targetMode);
    setTimeLeft(MODES[targetMode].minutes * 60);
  }, [mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      Promise.resolve().then(() => setIsActive(false));
      
      const handleComplete = async () => {
        setIsSaving(true);
        const sortedTasks = getSortedTasks();
        const currentTaskId = mode === 'POMODORO' ? sortedTasks[0]?.id : undefined;
        
        await completeSession(MODES[mode].minutes, mode, currentTaskId);
        setIsSaving(false);

        // Auto-switch modes or play sound
        if (mode === 'POMODORO') {
          alert("Session terminée ! Prenez une pause.");
          resetTimer('SHORT_BREAK');
        } else {
          alert("Pause terminée ! Prêt à bosser ?");
          resetTimer('POMODORO');
        }
      };

      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, completeSession, resetTimer, getSortedTasks]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (MODES[mode].minutes * 60)) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-4 sm:p-6 md:p-12 text-center relative overflow-hidden border-4 border-primary/20 bg-bg-alt/40 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
        {/* Progress Background */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-primary/20 transition-all duration-1000" 
          style={{ width: `${100 - progress}%` }} 
        />

        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-12">
          {(Object.keys(MODES) as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => resetTimer(m)}
              className={`px-3 md:px-4 py-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all border rounded-xl ${
                mode === m 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                  : "bg-bg-main text-text-secondary border-white/10 hover:border-primary/50"
              }`}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>

        <div className="mb-6 md:mb-12">
          <div className="text-4xl sm:text-7xl md:text-[120px] font-mono font-black text-text-main leading-none variant-numeric-tabular">
            {formatTime(timeLeft)}
          </div>
          <div className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mt-3 md:mt-4 ${MODES[mode].color}`}>
            {isActive ? "Session en cours" : "Prêt à l'action"}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
          <Button 
            size="lg" 
            onClick={toggleTimer}
            disabled={isSaving}
            className="w-full sm:w-48 h-14 md:h-16 text-base md:text-lg flex items-center justify-center gap-3"
          >
            {isSaving ? "Synchronisation..." : (
              <>
                {isActive ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
                {isActive ? "Pause" : "Démarrer"}
              </>
            )}
          </Button>
          
          <button 
            onClick={() => resetTimer()}
            className="w-full sm:w-16 h-14 md:h-16 flex items-center justify-center border-2 border-white/10 text-text-secondary hover:text-danger hover:border-danger transition-all bg-bg-main rounded-xl"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-12">
        <div className="bg-bg-alt/60 p-6 md:p-8 border border-white/5 flex items-center gap-4 md:gap-6 backdrop-blur-sm">
          <div className="bg-primary/10 p-3 md:p-4 text-primary shadow-inner">
            <Brain size={24} className="md:w-8 md:h-8" />
          </div>
          <div>
            <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Session Complète</div>
            <div className="text-lg md:text-xl font-bold">+50 XP</div>
          </div>
        </div>
        <div className="bg-bg-alt/60 p-6 md:p-8 border border-white/5 flex items-center gap-4 md:gap-6 backdrop-blur-sm">
          <div className="bg-secondary/10 p-3 md:p-4 text-secondary shadow-inner">
            <Coffee size={24} className="md:w-8 md:h-8" />
          </div>
          <div>
            <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Pause Longue</div>
            <div className="text-lg md:text-xl font-bold">+120 XP</div>
          </div>
        </div>
      </div>
    </div>
  );
};
