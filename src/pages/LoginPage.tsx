import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CASE_NUMBER } from "../data/constants";

const INTAKE_PATH = `/case/${CASE_NUMBER}/intake`;

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={INTAKE_PATH} replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const success = login(email, password);
    if (success) {
      navigate(INTAKE_PATH, { replace: true });
      return;
    }

    setError("Enter your email and password to continue.");
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-full items-center justify-center bg-page px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex justify-center">
            <img
              src="/awhl-logo.jpeg"
              alt="Assaulted Women's Helpline"
              className="h-24 w-auto object-contain"
            />
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-slate-900">
              Operator sign in
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Demo access for CrisisPoint staff workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="operator@awhl.org"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-light disabled:opacity-70"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Demo only — any email and password will sign you in.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
