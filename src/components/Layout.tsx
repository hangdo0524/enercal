import type { ReactNode } from "react";
import type { ViewType } from "../App";
import { TopNav } from "./TopNav";

interface NumerologyProfile {
  id: string;
  name: string;
  role: string;
}

interface LayoutProps {
  children: ReactNode;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  numProfileId: string;
  onNumProfileChange: (id: string) => void;
  numProfiles: NumerologyProfile[];
}

export function Layout({
  children,
  view,
  onViewChange,
  selectedDate,
  onDateChange,
  numProfileId,
  onNumProfileChange,
  numProfiles,
}: LayoutProps) {

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans overflow-hidden">
      <TopNav
        view={view}
        onViewChange={onViewChange}
        selectedPersonId={numProfileId}
        onPersonChange={onNumProfileChange}
        people={numProfiles}
      />

      {/* Secondary header for date picker on calendar view only */}
      {view === "calendar" && (
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
          <span className="text-sm text-slate-600">Tuần/Tháng</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-slate-50 cursor-pointer outline-none"
          />
        </div>
      )}

      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
