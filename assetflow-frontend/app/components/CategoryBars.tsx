"use client";

import { useState } from "react";
import type { CategoryDatum } from "@/app/lib/data";

export default function CategoryBars({ data }: { data: CategoryDatum[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex flex-col gap-4">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const active = hover === i;
        return (
          <div
            key={d.label}
            className="relative"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="font-semibold text-[var(--ink-2)]">{d.label}</span>
              <span className="tnum text-[var(--ink-muted)]">{d.value.toLocaleString()}</span>
            </div>
            {/* track (2px surface gap via padding on fill) */}
            <div className="h-3 w-full overflow-hidden rounded-[4px] bg-[var(--panel-3)]">
              <div
                className="h-full rounded-[4px] transition-[filter] duration-150"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, var(--brand-deep), var(--series-1))",
                  filter: active ? "brightness(1.18)" : "none",
                }}
              />
            </div>

            {active && (
              <div className="viz-tip" style={{ left: `${Math.min(pct, 92)}%`, top: "0.2rem" }}>
                <div className="text-[var(--ink-muted)]">{d.label}</div>
                <div className="tnum font-bold">{d.value.toLocaleString()} units</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
