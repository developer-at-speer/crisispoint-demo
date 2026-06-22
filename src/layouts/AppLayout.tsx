import { Outlet } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { LeftRail } from "../components/LeftRail";

export function AppLayout() {
  return (
    <div className="flex h-full min-w-[1280px] flex-col overflow-hidden bg-white">
      <AppHeader />
      <div className="flex min-h-0 flex-1">
        <LeftRail />
        <div className="min-h-0 flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
