import type { FleetStatus, FleetUnit } from "@/app/lib/data";

const STATUS: Record<FleetStatus, { label: string; icon: string; color: string }> = {
  operational: { label: "Operational", icon: "●", color: "var(--good)" },
  maintenance: { label: "Maintenance", icon: "▲", color: "var(--warning)" },
  offline: { label: "Offline", icon: "■", color: "var(--critical)" },
};

export default function FleetTable({ units }: { units: FleetUnit[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left">
            {["Unit", "ID", "Depot", "Status", "Utilization", "Updated"].map((h) => (
              <th key={h} className="eyebrow border-b border-[var(--hair)] px-3 py-3 font-extrabold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {units.map((u) => {
            const s = STATUS[u.status];
            return (
              <tr key={u.code} className="fleet-row border-b border-[var(--hair)]">
                <td className="px-3 py-3.5 font-semibold">{u.name}</td>
                <td className="tnum px-3 py-3.5 text-[var(--ink-muted)]">{u.code}</td>
                <td className="px-3 py-3.5 text-[var(--ink-2)]">{u.depot}</td>
                <td className="px-3 py-3.5">
                  {/* status = icon + label, never color alone */}
                  <span className="inline-flex items-center gap-2 font-semibold">
                    <span aria-hidden style={{ color: s.color }}>{s.icon}</span>
                    {s.label}
                  </span>
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 overflow-hidden rounded-full bg-[var(--panel-3)]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${u.utilization}%`, background: "var(--series-1)" }}
                      />
                    </div>
                    <span className="tnum text-[var(--ink-muted)]">{u.utilization}%</span>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-[var(--ink-muted)]">{u.updated}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
