"use client";

import React, { useEffect, useState } from "react";
import { StatsControllerService } from "@/lib";
import { LeaderboardEntry } from "@/types";
import { Card } from "@/components/ui/Card";
import { Trophy, Medal, Star } from "lucide-react";

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await StatsControllerService.getLeaderboard(10);
        const mappedLeaderboard = (data || []).map(entry => ({
          username: entry.username || "Anonyme",
          totalPoints: entry.totalPoints || 0,
          level: entry.level || 1,
          levelTitle: entry.levelTitle || "Novice"
        }));
        setLeaderboard(mappedLeaderboard);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-black uppercase tracking-widest text-text-main flex items-center gap-2">
        <Trophy className="text-tertiary" size={18} />
        Classement de l'Elite
      </h3>
      
      <Card className="overflow-hidden border-white/5 p-0 bg-bg-alt/40 backdrop-blur-md">
        <div className="divide-y divide-white/5">
          {leaderboard.map((entry, index) => (
            <div key={index} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 flex justify-center font-black text-text-secondary italic">
                  {index === 0 ? <Trophy className="text-tertiary" size={20} /> : 
                   index === 1 ? <Medal className="text-gray-400" size={20} /> :
                   index === 2 ? <Medal className="text-amber-700" size={20} /> :
                   `#${index + 1}`}
                </div>
                <div>
                  <div className="font-bold text-text-main">{entry.username}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{entry.levelTitle}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-primary font-black">
                  <Star size={14} fill="currentColor" />
                  {entry.totalPoints}
                </div>
                <div className="text-[9px] font-bold text-text-secondary uppercase">Points</div>
              </div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div className="p-8 text-center text-text-secondary italic">Aucune donnée disponible.</div>
          )}
        </div>
      </Card>
    </div>
  );
};
