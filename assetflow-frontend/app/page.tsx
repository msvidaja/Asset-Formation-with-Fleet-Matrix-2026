import TopBar from "@/app/components/TopBar";
import StatTile from "@/app/components/StatTile";
import UptimeChart from "@/app/components/UptimeChart";
import CategoryBars from "@/app/components/CategoryBars";
import FleetTable from "@/app/components/FleetTable";
import { uptime } from "@/app/lib/data";
import { getDashboardData } from "@/app/lib/api";

export default async function Home() {
  const { kpis, categories, fleet, live } = await getDashboardData();

  return (
    <div className="flex flex-1 flex-col">
      <TopBar />

      <main className="mx-auto w-full max-w-[1240px] flex-1 px-5 pb-20 pt-8 sm:px-8">
        {!live && (
          <div className="mb-6 rounded-lg border border-[var(--hair)] bg-[var(--panel-3)] px-4 py-3 text-sm text-[var(--ink-2)]">
            <span aria-hidden>⚠️</span>{" "}
            Backend unavailable — showing demo data. Start the API (and Postgres)
            to see live fleet data.
          </div>
        )}

        {/* Hero */}
        <section className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <span className="eyebrow">Fleet Matrix · Live Ops</span>
            <h1 className="display text-4xl sm:text-5xl">
              Command your <span className="text-[var(--brand)]">whole fleet.</span>
            </h1>
            <p className="max-w-xl text-[var(--ink-2)]">
              Every asset, every depot, one screen. Deploy units, chase down maintenance,
              and keep the floor gang rolling. ✊
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn-ghost text-sm">Last 30 days ▾</button>
            <button className="btn-brand text-sm">Export report</button>
          </div>
        </section>

        {/* KPI row */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <StatTile key={k.label} kpi={k} />
          ))}
        </section>

        {/* Charts */}
        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="panel p-6 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="display text-xl">Fleet Uptime</h2>
                <p className="text-sm text-[var(--ink-muted)]">Monthly average across all depots</p>
              </div>
              <span className="pill pill-up">▲ +1.1% vs last yr</span>
            </div>
            <UptimeChart data={uptime} />
          </div>

          <div className="panel p-6">
            <div className="mb-5">
              <h2 className="display text-xl">Assets by Category</h2>
              <p className="text-sm text-[var(--ink-muted)]">Total units per class</p>
            </div>
            <CategoryBars data={categories} />
          </div>
        </section>

        {/* Fleet table */}
        <section className="panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="display text-xl">Active Fleet</h2>
              <p className="text-sm text-[var(--ink-muted)]">Units reporting in the last hour</p>
            </div>
            <button className="btn-ghost text-sm">View all</button>
          </div>
          <FleetTable units={fleet} />
        </section>

        <footer className="mt-10 flex items-center justify-between border-t border-[var(--hair)] pt-6 text-sm text-[var(--ink-muted)]">
          <span>AssetFlow — Fleet Matrix 2026</span>
          <span>Made with ✊ by the floor gang</span>
        </footer>
      </main>
    </div>
  );
}
