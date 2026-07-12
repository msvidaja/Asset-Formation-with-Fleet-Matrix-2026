// Demo data for the AssetFlow — Fleet Matrix dashboard.
// Static mock values until the assets/fleet backend endpoints exist.

export type Trend = "up" | "down";

export interface Kpi {
  label: string;
  value: string;
  sub: string;
  delta: string;
  trend: Trend;
}

export const kpis: Kpi[] = [
  { label: "Total Assets", value: "9,847", sub: "across 12 depots", delta: "+4.2%", trend: "up" },
  { label: "Fleet Uptime", value: "98.6%", sub: "rolling 30 days", delta: "+1.1%", trend: "up" },
  { label: "Units Deployed", value: "1,204", sub: "active right now", delta: "+63", trend: "up" },
  { label: "Maintenance Due", value: "37", sub: "within 7 days", delta: "-12", trend: "down" },
];

// Fleet uptime %, one point per month. Single measure over time.
export interface UptimePoint {
  month: string;
  value: number;
}

export const uptime: UptimePoint[] = [
  { month: "Jan", value: 94.1 },
  { month: "Feb", value: 95.0 },
  { month: "Mar", value: 93.4 },
  { month: "Apr", value: 96.2 },
  { month: "May", value: 97.1 },
  { month: "Jun", value: 96.5 },
  { month: "Jul", value: 98.0 },
  { month: "Aug", value: 97.6 },
  { month: "Sep", value: 98.9 },
  { month: "Oct", value: 98.2 },
  { month: "Nov", value: 99.1 },
  { month: "Dec", value: 98.6 },
];

// Assets grouped by category. Same measure across categories -> single hue.
export interface CategoryDatum {
  label: string;
  value: number;
}

export const categories: CategoryDatum[] = [
  { label: "Haulers", value: 3120 },
  { label: "Loaders", value: 2340 },
  { label: "Drones", value: 1880 },
  { label: "Chargers", value: 1290 },
  { label: "Sensors", value: 1217 },
];

export type FleetStatus = "operational" | "maintenance" | "offline";

export interface FleetUnit {
  id: string;
  name: string;
  depot: string;
  status: FleetStatus;
  utilization: number; // percent
  updated: string;
}

export const fleet: FleetUnit[] = [
  { id: "FM-2201", name: "Brofist Hauler", depot: "Tokyo-1", status: "operational", utilization: 92, updated: "2m ago" },
  { id: "FM-1180", name: "Nine-Year Loader", depot: "Brighton", status: "operational", utilization: 88, updated: "6m ago" },
  { id: "FM-3390", name: "Chair Drone MK4", depot: "Tokyo-2", status: "maintenance", utilization: 41, updated: "14m ago" },
  { id: "FM-0455", name: "Floor Gang Charger", depot: "Osaka", status: "operational", utilization: 76, updated: "21m ago" },
  { id: "FM-7712", name: "Meme Sensor Array", depot: "Brighton", status: "offline", utilization: 0, updated: "1h ago" },
  { id: "FM-6089", name: "Bro Loader XL", depot: "Tokyo-1", status: "operational", utilization: 95, updated: "3m ago" },
];
