import type { Kpi } from "@/app/lib/data";

export default function StatTile({ kpi }: { kpi: Kpi }) {
  const up = kpi.trend === "up";
  return (
    <div className="panel flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between">
        <span className="eyebrow">{kpi.label}</span>
        <span className={`pill ${up ? "pill-up" : "pill-down"}`}>
          <span aria-hidden>{up ? "▲" : "▼"}</span>
          {kpi.delta}
        </span>
      </div>
      <div className="display tnum text-4xl">{kpi.value}</div>
      <div className="text-sm text-[var(--ink-muted)]">{kpi.sub}</div>
    </div>
  );
}
