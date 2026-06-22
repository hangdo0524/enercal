import { useState, type ReactNode } from "react";
import type { ViewType } from "../App";
import type { ProcessedProfile } from "../types";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  profileId: string;
  onProfileChange: (id: string) => void;
  profiles: ProcessedProfile[];
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function Layout({
  children,
  view,
  onViewChange,
  profileId,
  onProfileChange,
  profiles,
  selectedDate,
  onDateChange,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <Sidebar
          view={view}
          onViewChange={(v) => {
            onViewChange(v);
            setSidebarOpen(false);
          }}
        />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 md:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 md:px-8 shadow-sm z-10">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <svg
                className="w-5 h-5 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 className="text-base md:text-xl font-semibold text-slate-800">
              {view === "daily" ? "Lịch Ngày" : "Lịch Tuần / Tháng"}
            </h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {view === "daily" && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="rounded-md border border-slate-300 shadow-sm px-2 md:px-3 py-1 md:py-1.5 bg-slate-50 cursor-pointer outline-none text-xs md:text-sm w-[130px] md:w-auto"
              />
            )}

            <div className="flex items-center gap-1 md:gap-2">
              <span className="text-xs md:text-sm text-slate-500 hidden sm:inline">
                Xem:
              </span>
              <select
                value={profileId}
                onChange={(e) => onProfileChange(e.target.value)}
                className="rounded-md border border-slate-300 shadow-sm px-2 md:px-4 py-1 md:py-1.5 bg-slate-50 cursor-pointer outline-none text-xs md:text-sm max-w-[120px] md:max-w-none"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden p-2 md:p-4">{children}</div>
      </main>
    </div>
  );
}
