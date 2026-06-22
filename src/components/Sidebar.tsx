import type { ViewType } from "../App";

interface SidebarProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ view, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200 p-4 flex flex-col gap-2 shrink-0">
      <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-energy-purple to-energy-orange bg-clip-text text-transparent mb-4">
        Lịch Năng Lượng
      </h1>

      <button
        onClick={() => onViewChange("daily")}
        className={`text-left px-4 py-2 rounded-lg transition-colors ${
          view === "daily"
            ? "bg-energy-purple/10 text-energy-purple font-semibold"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        Lịch Ngày
      </button>

      <button
        onClick={() => onViewChange("calendar")}
        className={`text-left px-4 py-2 rounded-lg transition-colors ${
          view === "calendar"
            ? "bg-energy-purple/10 text-energy-purple font-semibold"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        Lịch Tuần / Tháng
      </button>

      <div className="mt-auto pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-500 space-y-2">
          <p className="font-medium mb-2">Chú thích màu:</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-energy-green inline-block" />
            <span>Dồi dào (&gt;100%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-energy-yellow inline-block" />
            <span>Mạnh (≥80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-energy-orange inline-block" />
            <span>Trung bình (≥60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-energy-red inline-block" />
            <span>Yếu (≥40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-energy-purple inline-block" />
            <span>Suy kiệt (&lt;40%)</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
