import type { ViewType } from "../App";

interface SidebarProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ view, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200 p-4 flex flex-col gap-2 shrink-0">
      <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-energy-purple to-energy-orange bg-clip-text text-transparent mb-2">
        Gia Đình
      </h1>

      {/* Family Section - Shared */}
      <div className="mb-2">
        <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>👨‍👩‍👧‍👦</span>
          <span>Gia đình (Chung)</span>
        </div>
        <button
          onClick={() => onViewChange("numerology-family")}
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            view === "numerology-family"
              ? "bg-energy-orange/10 text-energy-orange font-semibold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Phân tích gia đình
        </button>
        <button
          onClick={() => onViewChange("numerology-roadmap")}
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            view === "numerology-roadmap"
              ? "bg-energy-orange/10 text-energy-orange font-semibold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Lộ trình 5 năm gia đình
        </button>
      </div>

      {/* Individual Section - Per user */}
      <div className="mb-2">
        <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>👤</span>
          <span>Cá nhân (Theo user)</span>
        </div>
        <button
          onClick={() => onViewChange("numerology-personal")}
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            view === "numerology-personal"
              ? "bg-energy-purple/10 text-energy-purple font-semibold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Hồ sơ thần số học
        </button>
        <button
          onClick={() => onViewChange("numerology-personal-roadmap")}
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            view === "numerology-personal-roadmap"
              ? "bg-energy-purple/10 text-energy-purple font-semibold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Lộ trình 5 năm cá nhân
        </button>
        <button
          onClick={() => onViewChange("daily")}
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            view === "daily"
              ? "bg-energy-purple/10 text-energy-purple font-semibold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Lịch năng lượng ngày
        </button>
        <button
          onClick={() => onViewChange("calendar")}
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            view === "calendar"
              ? "bg-energy-purple/10 text-energy-purple font-semibold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Lịch tuần / tháng
        </button>
      </div>

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
