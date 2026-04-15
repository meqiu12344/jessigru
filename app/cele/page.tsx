"use client";

import { useState, useEffect } from "react";
import type { Goal } from "@/lib/timeline";
import { fetchGoals } from "@/lib/timeline";
import { GoalsSection } from "@/components/goals/goals-section";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGoals = async () => {
    try {
      setError(null);
      const loadedGoals = await fetchGoals();
      setGoals(loadedGoals);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  return (
    <main className="space-y-8 p-4 md:p-8">
      <section className="glass-panel p-8 md:p-12">
        <p className="text-sm font-semibold tracking-[0.2em] text-rose-500/80 uppercase">
          Nasze cele
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-800 md:text-5xl">
          Marzenia warte realizacji
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
          Razem jesteśmy silniejsi. Wspólne cele to droga do jeszcze bliższego związku. Każdy osiągnięty punkt to kolejna wygrana naszej miłości.
        </p>
      </section>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">
          ⚠️ {error}
        </div>
      )}

      <GoalsSection goals={goals} isLoaded={isLoaded} onRefresh={loadGoals} />
    </main>
  );
}
