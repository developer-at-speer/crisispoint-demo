import { systemStatusItems } from "../data/callQueue";

const statusStyles = {
  connected: "bg-green-500",
  online: "bg-green-500",
  updated: "bg-green-500",
  degraded: "bg-amber-400",
};

export function SystemStatusWidget() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">System status</h2>
      <p className="mt-1 text-xs text-slate-500">
        Operational health for call and referral workflows
      </p>
      <ul className="mt-4 space-y-3">
        {systemStatusItems.map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${statusStyles[item.status]}`}
                aria-hidden
              />
              <span className="text-sm text-slate-700">{item.label}</span>
            </div>
            <span className="text-xs text-slate-500">
              {item.detail ??
                (item.status === "connected"
                  ? "Connected"
                  : item.status === "online"
                    ? "Online"
                    : "Updated")}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
