"use client";

import Link from "next/link";
import type { Goal } from "@/lib/timeline";
import { GoalCard } from "./goal-card";

type GoalsSectionProps = {
  goals: Goal[];
  isLoaded: boolean;
  onRefresh?: () => void;
};

export function GoalsSection({ goals, isLoaded, onRefresh }: GoalsSectionProps) {
  const activeGoals = goals.filter((g) => !g.completed && (g.currentValue / g.targetValue) < 1);
  const completedGoals = goals.filter((g) => g.completed || (g.currentValue / g.targetValue) >= 1);

  return (
    <section className="glass-panel p-6 md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-semibold text-zinc-800 md:text-2xl">Nasze wspólne marzenia</h2>
          <p className="mt-2 text-zinc-600">Cele, które nas połączą i inspirują na każdy dzień</p>
        </div>

        <Link
          href="/dodaj-cel"
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-rose-400 to-fuchsia-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-300/40 transition hover:scale-[1.02] hover:from-rose-500 hover:to-fuchsia-500"
        >
          + Dodaj cel
        </Link>
      </div>

      {isLoaded ? (
        <>
          {goals.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center">
              <div className="text-5xl">✨</div>
              <h3 className="text-xl font-semibold text-zinc-700">Brak celów</h3>
              <p className="max-w-sm text-zinc-600">
                Dodajcie wspólne cele i realizujcie je razem. To, co się zaplanuje, łatwiej się osiąga.
              </p>
              <Link
                href="/dodaj-cel"
                className="mt-4 inline-block rounded-2xl bg-gradient-to-r from-rose-400 to-fuchsia-400 px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-[1.05] hover:from-rose-500 hover:to-fuchsia-500"
              >
                Stwórz pierwszy cel
              </Link>
            </div>
          ) : (
            <>
              {activeGoals.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-zinc-800">W trakcie realizacji ({activeGoals.length})</h3>
                  <div className="mt-4 space-y-4">
                    {activeGoals.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} onUpdate={onRefresh} />
                    ))}
                  </div>
                </div>
              )}

              {completedGoals.length > 0 && (
                <div className={`${activeGoals.length > 0 ? "mt-8" : "mt-8"}`}>
                  <h3 className="text-lg font-semibold text-green-700">Ukończone ({completedGoals.length}) 🎉</h3>
                  <div className="mt-4 space-y-4">
                    {completedGoals.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} onUpdate={onRefresh} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="mt-8 flex items-center justify-center">
          <p className="text-zinc-500">Ładowanie celów...</p>
        </div>
      )}
    </section>
  );
}
