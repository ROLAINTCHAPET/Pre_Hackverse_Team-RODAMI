"use client";

import React, { useState } from "react";
import { Plus, Trash2, CheckCircle, Play, Tag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/context/AppContext";
import { Priority, TaskStatus } from "@/types";
import { cn } from "@/lib/utils";

export const TaskList = () => {
  const { getSortedTasks, addTask, updateTaskStatus, deleteTask, isLoading: contextLoading } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | number | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("MEDIUM");
  const [newTaskDeadline, setNewTaskDeadline] = useState(new Date().toISOString().split('T')[0]);

  const sortedTasks = getSortedTasks();

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setIsActionLoading("adding");
    try {
      await addTask({
        title: newTaskTitle,
        priority: newTaskPriority,
        deadline: newTaskDeadline,
      });
      setNewTaskTitle("");
      setIsAdding(false);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleStatusUpdate = async (id: string | number, status: TaskStatus) => {
    setIsActionLoading(id);
    await updateTaskStatus(id, status);
    setIsActionLoading(null);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Supprimer cette tâche ?")) return;
    setIsActionLoading(id);
    await deleteTask(id);
    setIsActionLoading(null);
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'HIGH': return 'text-red-500';
      case 'MEDIUM': return 'text-amber-500';
      case 'LOW': return 'text-emerald-500';
    }
  };

  if (contextLoading && sortedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-text-secondary font-black uppercase tracking-widest text-[10px]">Chargement des tâches...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-text-main flex items-center gap-3">
          <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          Mes Tâches
        </h2>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <Plus size={18} />
          Nouvelle Tâche
        </Button>
      </div>

      {isAdding && (
        <Card className="p-4 md:p-8 border-2 border-primary/20 bg-bg-alt/40 backdrop-blur-xl">
          <form onSubmit={handleAddTask} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary block mb-2">Titre de la tâche</label>
                <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-bg-main border border-white/10 p-3 md:p-4 rounded-xl focus:border-primary outline-none text-base md:text-lg font-bold text-text-main transition-all"
                  placeholder="Qu'allez-vous accomplir ?"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary block mb-2">Priorité</label>
                <select 
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                  className="w-full bg-bg-main border border-white/10 p-3 md:p-4 rounded-xl focus:border-primary outline-none text-sm md:text-base text-text-main"
                >
                  <option value="LOW" className="bg-bg-main text-white">Basse</option>
                  <option value="MEDIUM" className="bg-bg-main text-white">Moyenne</option>
                  <option value="HIGH" className="bg-bg-main text-white">Haute</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary block mb-2">Date limite (Deadline)</label>
                <input 
                  type="date" 
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                  className="w-full bg-bg-main border border-white/10 p-3 md:p-4 rounded-xl focus:border-primary outline-none text-sm md:text-base text-text-main"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button type="submit" className="flex-1 order-2 sm:order-1" disabled={isActionLoading === "adding"}>
                {isActionLoading === "adding" ? "Création..." : "Créer la tâche"}
              </Button>
              <Button variant="secondary" onClick={() => setIsAdding(false)} className="w-full sm:w-32 order-1 sm:order-2">Annuler</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12 md:py-20 bg-bg-alt/20 border border-dashed border-white/10 rounded-2xl">
            <p className="text-text-secondary font-bold uppercase tracking-widest text-[9px] md:text-[10px] px-4">Aucune tâche enregistrée. Commencez par en créer une !</p>
          </div>
        ) : (
          sortedTasks.map((task, idx) => (
            <Card key={task.id} className={cn(
              "p-4 md:p-6 group transition-all duration-300 border-l-4 md:border-l-8 bg-bg-alt/20",
              idx === 0 && task.status !== 'DONE' ? "border-l-primary shadow-xl ring-2 ring-primary/5" : "border-l-white/5",
              task.status === 'DONE' && "opacity-40 grayscale shadow-none",
              isActionLoading === task.id && "animate-pulse"
            )}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                    {idx === 0 && task.status !== 'DONE' && (
                      <Badge variant="blue" className="bg-primary text-white border-none animate-pulse text-[8px] md:text-[10px]">À faire maintenant</Badge>
                    )}
                    <Badge variant={task.status === 'DONE' ? 'emerald' : 'amber'} className="text-[8px] md:text-[9px]">
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <h3 className={cn("text-lg md:text-xl font-bold text-text-main mb-2 leading-tight", task.status === 'DONE' && "line-through")}>
                    {task.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <Tag size={12} className={getPriorityColor(task.priority as Priority)} />
                      {task.priority}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 pt-4 md:pt-0 border-t border-white/5 md:border-t-0">
                  <div className="flex items-center gap-2">
                    {task.status !== 'DONE' && (
                      <>
                        {task.status === 'TODO' ? (
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleStatusUpdate(task.id, 'IN_PROGRESS')}
                            disabled={isActionLoading === task.id}
                            className="flex items-center gap-2 h-9 md:h-10 text-xs md:text-sm"
                          >
                            <Play size={14} /> <span className="hidden sm:inline">Démarrer</span>
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleStatusUpdate(task.id, 'DONE')}
                            disabled={isActionLoading === task.id}
                            className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 h-9 md:h-10 text-xs md:text-sm"
                          >
                            <CheckCircle size={14} /> <span className="hidden sm:inline">Terminer</span>
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    disabled={isActionLoading === task.id}
                    className="p-2 md:p-3 text-text-secondary hover:text-danger hover:bg-danger/10 transition-all border border-transparent hover:border-danger/20 rounded-xl"
                  >
                    <Trash2 size={18} className="md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

