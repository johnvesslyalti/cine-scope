"use client";

import { useState } from "react";

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

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={tab === "overview" ? "text-yellow-400" : ""}
          onClick={() => setTab("overview")}
        >
          Overview
        </button>
        <button
          className={tab === "cast" ? "text-yellow-400" : ""}
          onClick={() => setTab("cast")}
        >
          Cast
        </button>
        <button
          className={tab === "similar" ? "text-yellow-400" : ""}
          onClick={() => setTab("similar")}
        >
          Similar
        </button>
      </div>

      {/* Content */}
      <div className="bg-white/10 p-6 rounded-xl">
        {tab === "overview" && <p>{overview}</p>}
        {tab === "cast" && cast}
        {tab === "similar" && similar}
      </div>
    </div>
  );
}
