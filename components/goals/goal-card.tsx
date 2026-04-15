"use client";

import { useState } from "react";
import type { Goal } from "@/lib/timeline";
import { deleteGoal, completeGoal } from "@/lib/timeline";

type GoalCardProps = {
  goal: Goal;
  onUpdate?: () => void;
};

export function GoalCard({ goal, onUpdate }: GoalCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const progress = (goal.currentValue / goal.targetValue) * 100;
  const isCompleted = goal.completed || progress >= 100;

  const handleDelete = async () => {
    if (!confirm("Czy na pewno chcesz usunąć ten cel?")) return;
    setIsDeleting(true);
    try {
      await deleteGoal(goal.id);
      onUpdate?.();
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await completeGoal(goal.id);
      onUpdate?.();
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className={`glass-card rounded-3xl p-6 md:p-7 ${isCompleted ? "opacity-75" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{goal.icon}</span>
            <div>
              <h3 className={`text-lg font-semibold ${isCompleted ? "text-zinc-600 line-through" : "text-zinc-800"}`}>
                {goal.title}
              </h3>
              <p className="text-xs text-zinc-500">{goal.type}</p>
            </div>
          </div>

          <p className="mt-2 text-sm text-zinc-600">{goal.description}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-700">
                {goal.currentValue} / {goal.targetValue} {goal.unit}
              </span>
              <span className="text-xs font-semibold text-rose-500">{Math.round(progress)}%</span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-fuchsia-400 transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {goal.targetDate && (
            <p className="mt-2 text-xs text-zinc-500">
              📅 Termin: {new Date(goal.targetDate).toLocaleDateString("pl-PL")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {!isCompleted && (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="rounded-lg bg-gradient-to-r from-rose-400 to-fuchsia-400 px-3 py-1 text-xs font-semibold text-white shadow-md transition hover:scale-[1.05] hover:from-rose-500 hover:to-fuchsia-500 disabled:opacity-50"
            >
              {isCompleting ? "..." : "✓"}
            </button>
          )}
          {isCompleted && (
            <div className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              ✓ Ukończone
            </div>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg bg-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-300 disabled:opacity-50"
          >
            {isDeleting ? "..." : "✕"}
          </button>
        </div>
      </div>
    </div>
  );
}
