"use client";

import { useState } from "react";
import clsx from "clsx";

export default function MovieTabs({
  overview,
  cast,
  similar,
}: {
  overview: string;
  cast: React.ReactNode;
  similar: React.ReactNode;
}) {
  const [tab, setTab] = useState<"overview" | "cast" | "similar">("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "cast", label: "Cast" },
    { id: "similar", label: "Similar" },
  ] as const;

  return (
    <div className="mt-10">
      {/* Tabs */}
      <div className="flex gap-6 relative border-b border-white/10 pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              "pb-2 text-sm md:text-base font-medium transition-colors duration-300",
              tab === t.id
                ? "text-yellow-400"
                : "text-white/60 hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}

        {/* Underline */}
        <div
          className={clsx(
            "absolute bottom-0 h-[2px] bg-yellow-400 transition-all duration-300",
            tab === "overview" && "w-20 left-0",
            tab === "cast" && "w-12 left-[92px]",
            tab === "similar" && "w-14 left-[152px]"
          )}
        />
      </div>

      {/* Content Panel */}
      <div
        className="
          mt-6 
          p-6 
          rounded-2xl 
          bg-white/5 
          backdrop-blur-md 
          border border-white/10 
          transition-all 
          duration-300
        "
      >
        {tab === "overview" && (
          <p className="text-white/80 leading-relaxed">{overview}</p>
        )}

        {tab === "cast" && <div>{cast}</div>}

        {tab === "similar" && <div>{similar}</div>}
      </div>
    </div>
  );
}
