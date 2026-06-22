import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { getActiveNavId, navItems } from "../data/navigation";

function NavTooltip({ label, visible }: { label: string; visible: boolean }) {
  return (
    <motion.span
      initial={false}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -4 }}
      transition={{ duration: 0.15 }}
      className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"
      role="tooltip"
    >
      {label}
    </motion.span>
  );
}

function NavButton({ label, icon: Icon, to, active }: {
  label: string;
  icon: typeof navItems[0]["icon"];
  to: string;
  active: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setShowTooltip(true), 250);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowTooltip(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="relative">
      <NavLink
        to={to}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="block"
      >
        <motion.span
          layout
          transition={{ duration: 0.18 }}
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
            active
              ? "bg-purple-100 text-purple-800"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 2} />
        </motion.span>
      </NavLink>
      <NavTooltip label={label} visible={showTooltip} />
    </div>
  );
}

export function LeftRail() {
  const { pathname } = useLocation();
  const activeId = getActiveNavId(pathname);

  return (
    <nav
      className="flex w-16 shrink-0 flex-col items-center gap-1 border-r border-slate-200 bg-white py-5"
      aria-label="Main navigation"
    >
      {navItems.map((item) => (
        <NavButton
          key={item.id}
          label={item.label}
          icon={item.icon}
          to={item.path}
          active={item.id === activeId}
        />
      ))}
    </nav>
  );
}
