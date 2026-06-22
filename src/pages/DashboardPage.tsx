import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";
import { dashboardCases, dashboardStats } from "../data/dashboard";
import { CASE_NUMBER } from "../data/constants";

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div
      id="workspace-scroll"
      className="h-full overflow-y-auto overflow-x-hidden bg-page"
    >
      <PageTransition>
        <div className="mx-auto max-w-5xl p-8">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">
              What needs your attention right now
            </p>
          </header>

          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: index * 0.04 }}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
              </motion.div>
            ))}
          </div>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Active work
              </h2>
              <button
                type="button"
                onClick={() => navigate(`/case/${CASE_NUMBER}/intake`)}
                className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-light"
              >
                Start new intake
              </button>
            </div>

            <ul className="space-y-2">
              {dashboardCases.map((c, index) => (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/case/${c.id}/intake`)}
                    className={`flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left transition-colors hover:border-brand-accent hover:bg-purple-50/50 ${
                      c.highlight
                        ? "border-purple-200 bg-white shadow-sm"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-slate-900">{c.label}</p>
                      <p className="text-sm text-slate-600">{c.survivor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700">
                        {c.status}
                      </p>
                      <p className="text-xs text-slate-500">{c.updated}</p>
                    </div>
                  </button>
                </motion.li>
              ))}
            </ul>
          </section>
        </div>
      </PageTransition>
    </div>
  );
}
