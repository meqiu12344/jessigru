import Link from "next/link";
import type { TimelineEvent } from "@/lib/timeline";
import { TimelineEventCard } from "./timeline-event-card";

type TimelineSectionProps = {
  events: TimelineEvent[];
  isLoaded: boolean;
};

export function TimelineSection({ events, isLoaded }: TimelineSectionProps) {
  return (
    <section className="glass-panel p-6 md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-semibold text-zinc-800 md:text-2xl">Uwiecznij moment</h2>
          <p className="mt-2 text-zinc-600">Wspomnienia się dzieją — złap je i zapisz tutaj na zawsze.</p>
        </div>

        <Link
          href="/dodaj-wydarzenie"
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-rose-400 to-fuchsia-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-300/40 transition hover:scale-[1.02] hover:from-rose-500 hover:to-fuchsia-500"
        >
          Dodaj wspomnienie
        </Link>
      </div>

      <h2 className="mt-8 text-xl font-semibold text-zinc-800 md:text-2xl">Nasze najpiękniejsze wspomnienia</h2>

      <div className="relative mt-8 pl-6 md:pl-10">
        <div className="timeline-line" aria-hidden="true" />

        <ol className="timeline-list space-y-7 md:space-y-8" suppressHydrationWarning>
          {isLoaded ? (
            <>
              {events.map((event, index) => (
                <li
                  key={event.id}
                  className="timeline-item relative"
                  style={{ animationDelay: `${index * 140}ms` }}
                >
                  <div
                    className="timeline-dot"
                    aria-hidden="true"
                    style={{ animationDelay: `${index * 140 + 250}ms` }}
                  />

                  <TimelineEventCard event={event} />
                </li>
              ))}

              <li
                className="timeline-item relative"
                style={{ animationDelay: `${events.length * 140}ms` }}
              >
                <div
                  className="timeline-dot"
                  aria-hidden="true"
                  style={{ animationDelay: `${events.length * 140 + 250}ms` }}
                />

                <div className="glass-card timeline-card overflow-hidden rounded-3xl">
                  <div className="flex items-center justify-center p-8 md:p-10">
                    <div className="text-center">
                      <p className="text-sm font-semibold tracking-[0.2em] text-rose-500/80 uppercase">
                        Ciąg dalszy nastąpi...
                      </p>
                      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-800 md:text-3xl">
                        To dopiero początek naszej historii
                      </h3>
                      <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-600 md:text-lg">
                        Najlepsze wspomnienia jeszcze przed nami. Każdy dzień z Tobą jest przygodą wartą zapamiętania, każdy moment magiczny. Czekamy na kolejne rozdziały naszej miłości.
                      </p>
                      <Link
                        href="/dodaj-wydarzenie"
                        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-rose-400 to-fuchsia-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-300/40 transition hover:scale-[1.02] hover:from-rose-500 hover:to-fuchsia-500"
                      >
                        Dodaj nowe wspomnienie
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            </>
          ) : (
            <li className="flex items-center justify-center py-12">
              <p className="text-zinc-500">Ładowanie osi czasu...</p>
            </li>
          )}
        </ol>
      </div>
    </section>
  );
}