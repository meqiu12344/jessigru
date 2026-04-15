"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchTimelineEvents, fetchGoals, toSortableDate, type TimelineEvent, type Goal } from "@/lib/timeline";
import { HomeTabs, type HomeTab } from "@/components/home/home-tabs";
import { RelationshipCounter, parseStartDate } from "@/components/home/relationship-counter";
import { TimelineSection } from "@/components/home/timeline-section";
import { GoalsSection } from "@/components/goals/goals-section";

export default function Home() {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<HomeTab>("timeline");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [events, goalsData] = await Promise.all([
          fetchTimelineEvents(),
          fetchGoals(),
        ]);

        if (isMounted) {
          setTimelineEvents(events);
          setGoals(goalsData);
          setIsLoaded(true);
        }
      } catch {
        if (isMounted) {
          setTimelineEvents([]);
          setGoals([]);
          setIsLoaded(true);
        }
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedTimeline = useMemo(() => {
    return [...timelineEvents].sort((a, b) => {
      return toSortableDate(a.date) > toSortableDate(b.date) ? 1 : -1;
    });
  }, [timelineEvents]);

  const relationshipStartDate = useMemo(() => {
    const configuredStartDate = parseStartDate(
      process.env.NEXT_PUBLIC_RELATIONSHIP_START_DATE,
    );

    if (configuredStartDate) {
      return configuredStartDate;
    }

    if (sortedTimeline.length > 0) {
      return parseStartDate(sortedTimeline[0].date);
    }

    return null;
  }, [sortedTimeline]);

  const handleGoalsRefresh = async () => {
    try {
      const goalsData = await fetchGoals();
      setGoals(goalsData);
    } catch {
      // Handle error silently
    }
  };

  return (
    <div className="romance-background min-h-screen">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 md:px-10 md:py-14">
        <section className="glass-panel p-8 md:p-12">
          <p className="text-sm font-semibold tracking-[0.2em] text-rose-500/80 uppercase">
            Nasza miłość
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-800 md:text-5xl">
            Każda chwila z Tobą jest wspomnieniem
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
            Ta oś czasu to księga naszej historii — każdy moment, każdy uśmiech, każde spojrzenie, które warte jest bycia zapamiętanym. Dodawajmy tutaj nasze najprzyjemniejsze wspomnienia i tworzmy razem nieskończoną opowieść naszej miłości.
          </p>
        </section>

        <HomeTabs activeTab={activeTab} onChange={setActiveTab} />

        <section className="tab-panel-shell">
          {activeTab === "timeline" ? (
            <div key="timeline" className="tab-panel tab-panel-enter">
              <TimelineSection events={sortedTimeline} isLoaded={isLoaded} />
            </div>
          ) : activeTab === "counter" ? (
            <div key="counter" className="tab-panel tab-panel-enter">
              <section className="glass-panel p-6 md:p-8">
                <RelationshipCounter
                  startDate={relationshipStartDate}
                  fallbackDate={sortedTimeline[0]?.date ?? ""}
                />
              </section>
            </div>
          ) : (
            <div key="goals" className="tab-panel tab-panel-enter">
              <GoalsSection goals={goals} isLoaded={isLoaded} onRefresh={handleGoalsRefresh} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
