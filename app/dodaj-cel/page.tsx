"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { GoalFormData, GoalType } from "@/lib/timeline";
import { createGoal } from "@/lib/timeline";

const GOAL_TYPES: { value: GoalType; label: string; icon: string }[] = [
  { value: "financial", label: "Finansowy (zaoszczędzić pieniądze)", icon: "💰" },
  { value: "days", label: "Czasowy (liczba dni)", icon: "📅" },
  { value: "quantity", label: "Ilościowy (liczba rzeczy)", icon: "📊" },
  { value: "travel", label: "Podróże (liczba krajów/miejsc)", icon: "✈️" },
  { value: "custom", label: "Niestandardowy", icon: "⭐" },
];

const SUGGESTED_UNITS: Record<GoalType, string[]> = {
  financial: ["PLN", "EUR", "USD", "zł"],
  days: ["dni", "dni razem"],
  quantity: ["sztuk", "książek", "filmów", "obiektów"],
  travel: ["krajów", "miast", "miejsc"],
  custom: ["jednostek", "razy"],
};

export default function AddGoalPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<GoalFormData>({
    title: "",
    description: "",
    type: "financial",
    currentValue: 0,
    targetValue: 100,
    unit: "PLN",
    icon: "💰",
    targetDate: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Value") ? parseFloat(value) || 0 : value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value as GoalType;
    const selectedGoalType = GOAL_TYPES.find((gt) => gt.value === selectedType);

    setFormData((prev) => ({
      ...prev,
      type: selectedType,
      icon: selectedGoalType?.icon || "⭐",
      unit: SUGGESTED_UNITS[selectedType][0],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (!formData.title.trim()) throw new Error("Wpisz tytuł celu");
      if (!formData.description.trim()) throw new Error("Wpisz opis celu");
      if (formData.currentValue < 0) throw new Error("Aktualna wartość nie może być ujemna");
      if (formData.targetValue <= 0) throw new Error("Docelowa wartość musi być większa niż 0");
      if (formData.currentValue > formData.targetValue) throw new Error("Aktualna wartość nie może być większa niż docelowa");

      await createGoal(formData);
      router.push("/cele");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="space-y-8 p-4 md:p-8">
      <section className="glass-panel p-8 md:p-12">
        <p className="text-sm font-semibold tracking-[0.2em] text-rose-500/80 uppercase">
          Nowy cel
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-800 md:text-4xl">
          Stwórz wspólne marzenie
        </h1>
      </section>

      <div className="mx-auto max-w-2xl">
        <section className="glass-panel p-8">
          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-600">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="field-wrap">
              <span className="field-label">Jaki jest typ tego celu?</span>
              <select
                name="type"
                value={formData.type}
                onChange={handleTypeChange}
                className="field-input"
              >
                {GOAL_TYPES.map((gt) => (
                  <option key={gt.value} value={gt.value}>
                    {gt.icon} {gt.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-wrap">
              <span className="field-label">Nazwa celu</span>
              <input
                required
                type="text"
                name="title"
                placeholder="Np. Wakacje w Grecji, 1000 dni razem..."
                value={formData.title}
                onChange={handleInputChange}
                className="field-input"
              />
            </label>

            <label className="field-wrap field-wrap-full">
              <span className="field-label">Opis</span>
              <textarea
                required
                name="description"
                rows={4}
                placeholder="Dlaczego chcemy osiągnąć ten cel? Co będzie oznaczać dla nas? Jaki będzie jego wpływ na naszą miłość?"
                value={formData.description}
                onChange={handleInputChange}
                className="field-input field-textarea"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="field-wrap">
                <span className="field-label">Aktualna wartość</span>
                <input
                  required
                  type="number"
                  name="currentValue"
                  min="0"
                  value={formData.currentValue}
                  onChange={handleInputChange}
                  className="field-input"
                />
              </label>

              <label className="field-wrap">
                <span className="field-label">Wartość docelowa</span>
                <input
                  required
                  type="number"
                  name="targetValue"
                  min="1"
                  value={formData.targetValue}
                  onChange={handleInputChange}
                  className="field-input"
                />
              </label>
            </div>

            <label className="field-wrap">
              <span className="field-label">Jednostka</span>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="field-input"
              >
                {SUGGESTED_UNITS[formData.type].map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-wrap">
              <span className="field-label">Termin (opcjonalnie)</span>
              <input
                type="date"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleInputChange}
                className="field-input"
              />
            </label>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 rounded-2xl bg-gradient-to-r from-rose-400 to-fuchsia-400 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-300/40 transition hover:scale-[1.02] hover:from-rose-500 hover:to-fuchsia-500 disabled:opacity-50"
              >
                {isSaving ? "Uwieczniamy cel..." : "Dodaj cel 💪"}
              </button>

              <Link
                href="/cele"
                className="rounded-2xl border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition hover:bg-zinc-50"
              >
                Anuluj
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
