"use client";

import { useEffect, useState } from "react";

type DurationBreakdown = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function parseStartDate(value: string | undefined) {
  if (!value) {
    return null;
  }

  const isoFormat = /^\d{4}-\d{2}-\d{2}$/;
  const dottedFormat = /^\d{2}\.\d{2}\.\d{4}$/;

  const parsed = isoFormat.test(value)
    ? new Date(`${value}T00:00:00`)
    : dottedFormat.test(value)
      ? (() => {
          const [day, month, year] = value.split(".");
          return new Date(`${year}-${month}-${day}T00:00:00`);
        })()
      : new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function addYears(baseDate: Date, years: number) {
  const result = new Date(baseDate);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

function addMonths(baseDate: Date, months: number) {
  const result = new Date(baseDate);
  result.setMonth(result.getMonth() + months);
  return result;
}

function addDays(baseDate: Date, days: number) {
  const result = new Date(baseDate);
  result.setDate(result.getDate() + days);
  return result;
}

function calculateDuration(startDate: Date, endDate: Date): DurationBreakdown {
  if (endDate <= startDate) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  let cursor = new Date(startDate);

  let years = endDate.getFullYear() - cursor.getFullYear();
  let nextCursor = addYears(cursor, years);
  if (nextCursor > endDate) {
    years -= 1;
    nextCursor = addYears(cursor, years);
  }

  cursor = nextCursor;

  let months = endDate.getMonth() - cursor.getMonth();
  if (months < 0) {
    months += 12;
  }
  nextCursor = addMonths(cursor, months);
  if (nextCursor > endDate) {
    months -= 1;
    nextCursor = addMonths(cursor, months);
  }

  cursor = nextCursor;

  let days = Math.floor((endDate.getTime() - cursor.getTime()) / 86400000);
  nextCursor = addDays(cursor, days);
  if (nextCursor > endDate) {
    days -= 1;
    nextCursor = addDays(cursor, days);
  }

  cursor = nextCursor;

  const remainingMs = Math.max(0, endDate.getTime() - cursor.getTime());
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
}

function formatCounterValue(value: number) {
  return value.toString().padStart(2, "0");
}

function CounterDigitCard({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent: string;
}) {
  return (
    <div className="counter-digit-card">
      <div className="counter-digit-shell" style={{ ["--counter-accent" as string]: accent }}>
        <span key={value} className="counter-digit-value">
          {formatCounterValue(value)}
        </span>
      </div>
      <span className="counter-digit-label">{label}</span>
    </div>
  );
}

type RelationshipCounterProps = {
  startDate?: Date | null;
  fallbackDate: string;
};

export function RelationshipCounter({ startDate, fallbackDate }: RelationshipCounterProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const activeStartDate = startDate ?? parseStartDate(fallbackDate);
  const duration = activeStartDate ? calculateDuration(activeStartDate, now) : null;
  const displayedStartDate = activeStartDate ?? new Date();

  if (!duration) {
    return (
      <div className="counter-empty-panel">
        <p className="text-lg font-semibold text-zinc-800">Dodaj datę rozpoczęcia relacji</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Uzupełnij zmienną <span className="font-semibold">NEXT_PUBLIC_RELATIONSHIP_START_DATE</span>
          w pliku <span className="font-semibold">.env.local</span>, aby licznik pokazywał dokładny czas razem.
        </p>
      </div>
    );
  }

  return (
    <div className="counter-panel">
      <div className="counter-heading">
        <p className="text-sm font-semibold tracking-[0.2em] text-rose-500/80 uppercase">Chwile liczą się w miłości</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-800 md:text-4xl">
          Od kiedy zmieniliśmy sobie życie
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 md:text-base">
          Każda sekunda razem to dar. Licznik poniżej liczy każdy magiczny moment naszej wspólnej drogi — lata pełne miłości, miesiące radości, dni przygód i sekundy, które stanowią nasze najpiękniejsze wspomnienia.
        </p>
      </div>

      <div className="counter-grid" aria-label="Licznik czasu razem">
        <CounterDigitCard value={duration.years} label="lat" accent="#fb7185" />
        <CounterDigitCard value={duration.months} label="miesięcy" accent="#c084fc" />
        <CounterDigitCard value={duration.days} label="dni" accent="#60a5fa" />
        <CounterDigitCard value={duration.hours} label="godzin" accent="#f59e0b" />
        <CounterDigitCard value={duration.minutes} label="minut" accent="#34d399" />
        <CounterDigitCard value={duration.seconds} label="sekund" accent="#f472b6" />
      </div>

      <div className="counter-footer">
        <div className="counter-ribbon" />
        <p>
          Start: <span>{displayedStartDate.toLocaleDateString("pl-PL")}</span>
        </p>
      </div>
    </div>
  );
}