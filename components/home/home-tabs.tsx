"use client";

type HomeTab = "timeline" | "counter" | "goals";

type HomeTabsProps = {
  activeTab: HomeTab;
  onChange: (tab: HomeTab) => void;
};

export function HomeTabs({ activeTab, onChange }: HomeTabsProps) {
  return (
    <section className="glass-panel p-4 md:p-5">
      <div className="tab-switcher" role="tablist" aria-label="Widoki strony głównej">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "timeline"}
          onClick={() => onChange("timeline")}
          className={`tab-button ${activeTab === "timeline" ? "tab-button-active" : ""}`}
        >
          Oś czasu
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "counter"}
          onClick={() => onChange("counter")}
          className={`tab-button ${activeTab === "counter" ? "tab-button-active" : ""}`}
        >
          Licznik razem
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "goals"}
          onClick={() => onChange("goals")}
          className={`tab-button ${activeTab === "goals" ? "tab-button-active" : ""}`}
        >
          Nasze cele
        </button>
      </div>
    </section>
  );
}

export type { HomeTab };