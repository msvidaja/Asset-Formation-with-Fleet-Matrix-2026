"use client";

import { useRef, useState } from "react";
import type { UptimePoint } from "@/app/lib/data";

const W = 720;
const H = 280;
const padL = 40;
const padR = 16;
const padT = 20;
const padB = 34;

export default function UptimeChart({ data }: { data: UptimePoint[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const values = data.map((d) => d.value);
  const min = Math.floor(Math.min(...values) - 1);
  const max = Math.ceil(Math.max(...values) + 0.5);

  const x = (i: number) => padL + (i / (data.length - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - min) / (max - min)) * (H - padT - padB);

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.value)}`).join(" ");
  const areaPath = `${linePath} L${x(data.length - 1)},${H - padB} L${x(0)},${H - padB} Z`;

  const gridVals = [min, (min + max) / 2, max];

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const frac = (e.clientX - rect.left) / rect.width;
    const i = Math.round(frac * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img" aria-label="Fleet uptime by month">
        <defs>
          <linearGradient id="uptimeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--series-1)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--series-1)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* gridlines + y labels */}
        {gridVals.map((v) => (
          <g key={v}>
            <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="var(--grid)" strokeWidth="1" />
            <text x={padL - 8} y={y(v) + 4} textAnchor="end" fill="var(--ink-muted)" fontSize="11" className="tnum">
              {v.toFixed(0)}%
            </text>
          </g>
        ))}

        {/* x labels */}
        {data.map((d, i) => (
          <text key={d.month} x={x(i)} y={H - padB + 20} textAnchor="middle" fill="var(--ink-muted)" fontSize="11">
            {d.month}
          </text>
        ))}

        <path d={areaPath} fill="url(#uptimeFill)" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--series-1)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* crosshair + marker */}
        {hover !== null && (
          <g>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={padT}
              y2={H - padB}
              stroke="var(--hair-strong)"
              strokeWidth="1"
            />
            <circle cx={x(hover)} cy={y(data[hover].value)} r="5" fill="var(--series-1)" stroke="var(--page)" strokeWidth="2" />
          </g>
        )}
      </svg>

      {hover !== null && (
        <div
          className="viz-tip"
          style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(data[hover].value) / H) * 100}%` }}
        >
          <div className="text-[var(--ink-muted)]">{data[hover].month}</div>
          <div className="tnum font-bold">{data[hover].value.toFixed(1)}% uptime</div>
        </div>
      )}
    </div>
  );
}
