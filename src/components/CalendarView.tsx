import { useState } from "react";
import type { ProcessedProfile } from "../types";
import {
  WEEKDAYS_VI,
  getMonthGrid,
  navigateMonth,
  navigateWeek,
  formatMonthYear,
  getWeekDates,
  getTodayStr,
} from "../utils/dates";
import { getEnergyBgClass, getEnergyBorderClass } from "../utils/colors";

interface CalendarViewProps {
  profile: ProcessedProfile;
  selectedDate: string;
  viewDate: string;
  onViewDateChange: (date: string) => void;
  onDayClick: (date: string) => void;
}

type CalendarMode = "month" | "week";

export function CalendarView({
  profile,
  selectedDate,
  viewDate,
  onViewDateChange,
  onDayClick,
}: CalendarViewProps) {
  const [mode, setMode] = useState<CalendarMode>("month");
  const today = getTodayStr();

  const navigate = (delta: number) => {
    onViewDateChange(
      mode === "month"
        ? navigateMonth(viewDate, delta)
        : navigateWeek(viewDate, delta)
    );
  };

  const goToToday = () => {
    onViewDateChange(today);
  };

  const monthYearLabel = formatMonthYear(viewDate);
  const weekDates = getWeekDates(viewDate);
  const monthGrid = getMonthGrid(viewDate);

  const renderDayCell = (dateStr: string | null) => {
    if (!dateStr) {
      return <div key={Math.random()} className="p-1 md:p-2" />;
    }

    const dayData = profile.days[dateStr];
    const dayNum = parseInt(dateStr.split("-")[2]);
    const isSelected = dateStr === selectedDate;
    const isToday = dateStr === today;

    if (!dayData) {
      return (
        <div
          key={dateStr}
          className="p-1 md:p-2 rounded-lg border border-slate-100 bg-slate-50/50 min-h-[60px] md:min-h-[90px] opacity-50"
        >
          <span className="text-xs text-slate-400">{dayNum}</span>
        </div>
      );
    }

    // Find best energy cell across all time slots
    const bestEnergy = dayData.hourlyGrid
      .flatMap((slot) => slot.energies)
      .reduce(
        (best, curr) => (curr.finalPct > best.finalPct ? curr : best),
        { task: "", dailyPct: 0, hourlyVal: 0, finalPct: 0 }
      );

    const hasGoodEnergy = bestEnergy.finalPct >= 46;
    const borderClass = hasGoodEnergy
      ? getEnergyBorderClass(bestEnergy.finalPct)
      : "border-slate-200";
    const bgClass = hasGoodEnergy ? getEnergyBgClass(bestEnergy.finalPct) : "";

    return (
      <div
        key={dateStr}
        onClick={() => onDayClick(dateStr)}
        className={`p-1 md:p-2 rounded-lg border-2 min-h-[60px] md:min-h-[90px] cursor-pointer transition-all hover:shadow-md ${borderClass} ${
          isSelected ? "ring-2 ring-energy-purple ring-offset-1" : ""
        } ${isToday ? "bg-yellow-50" : "bg-white"}`}
      >
        <div className="flex items-center justify-between mb-1">
          <span
            className={`text-xs font-bold ${isToday ? "text-energy-purple" : "text-slate-700"}`}
          >
            {dayNum}
          </span>
          <span className="text-[10px] md:text-xs text-slate-500 font-medium truncate ml-1 hidden sm:inline">
            {dayData.mainTask.replace("Ngày ", "")}
          </span>
        </div>
        {hasGoodEnergy && (
          <div
            className={`text-[10px] md:text-xs px-1 md:px-1.5 py-0.5 rounded font-semibold truncate ${bgClass}`}
          >
            <span className="hidden sm:inline">{bestEnergy.task} </span>
            {bestEnergy.finalPct}%
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-3 md:space-y-4 px-2 md:px-0">
      {/* Navigation header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 md:p-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-2 md:px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm font-medium"
          >
            ←
          </button>
          <button
            onClick={goToToday}
            className="px-2 md:px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs md:text-sm font-medium"
          >
            Hôm nay
          </button>
          <button
            onClick={() => navigate(1)}
            className="px-2 md:px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm font-medium"
          >
            →
          </button>
          <span className="ml-1 md:ml-2 text-base md:text-lg font-semibold text-slate-800 capitalize">
            {monthYearLabel}
          </span>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => setMode("week")}
            className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${
              mode === "week"
                ? "bg-energy-purple text-white"
                : "border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Tuần
          </button>
          <button
            onClick={() => setMode("month")}
            className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${
              mode === "month"
                ? "bg-energy-purple text-white"
                : "border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Tháng
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 md:p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          {WEEKDAYS_VI.map((day) => (
            <div
              key={day}
              className="text-center text-xs md:text-sm font-bold text-slate-500 py-1 md:py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        {mode === "week" ? (
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {weekDates.map(renderDayCell)}
          </div>
        ) : (
          <div className="space-y-1 md:space-y-2">
            {monthGrid.map((week, i) => (
              <div key={i} className="grid grid-cols-7 gap-1 md:gap-2">
                {week.map(renderDayCell)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hint */}
      <p className="text-center text-xs text-slate-400 italic">
        Click vào 1 ngày để xem chi tiết năng lượng
      </p>
    </div>
  );
}
