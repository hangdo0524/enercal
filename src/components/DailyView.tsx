import { useState } from "react";
import type { ProcessedProfile } from "../types";
import { ENERGY_TASKS } from "../types";
import { EnergyCell } from "./EnergyCell";
import { getSmallEnergyBgClass, getEnergyTextClass, getEnergyBgClass } from "../utils/colors";

interface DailyViewProps {
  profile: ProcessedProfile;
  date: string;
}

export function DailyView({ profile, date }: DailyViewProps) {
  const [filter, setFilter] = useState<"good" | "bad">("good");

  const dayData = profile.days[date];

  if (!dayData) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        Không có dữ liệu cho ngày {date}
      </div>
    );
  }

  const tasks = ENERGY_TASKS;
  const isGoodFilter = filter === "good";

  const filteredSlots = dayData.hourlyGrid.filter((slot) =>
    slot.energies.some((e) =>
      isGoodFilter ? e.finalPct > 100 : e.finalPct <= 100
    )
  );

  // Extract main task name without "Ngày " prefix
  const mainTaskName = dayData.mainTask.replace("Ngày ", "");

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Header summary */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-3 md:px-4 py-2 md:py-3 shrink-0">
        {/* Top row: main task info */}
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-sm md:text-base font-bold text-slate-800 leading-tight">
                {dayData.mainTask}
              </h2>
              <p className="text-xs text-slate-400">{date}</p>
            </div>
            {/* Daily value badge for main task */}
            <div className={`px-2 py-1 rounded-lg ${getEnergyBgClass(dayData.mainTaskDailyPct)}`}>
              <div className="text-xs font-semibold">D: {dayData.mainTaskDailyPct}%</div>
            </div>
          </div>

          {/* Best hour and top % */}
          <div className="text-right">
            <div className={`text-xl md:text-2xl font-black ${getEnergyTextClass(dayData.topPct)}`}>
              {dayData.topPct}%
            </div>
            <div className="text-[10px] md:text-xs text-slate-500">
              Giờ tốt: <span className="font-semibold text-slate-700">{dayData.bestHour}</span>
            </div>
          </div>
        </div>

        {/* Daily energy values grid - scrollable on mobile */}
        <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
          <div className="flex items-center gap-1 min-w-max md:min-w-0">
            {tasks.map((task) => {
              const dailyPct =
                dayData.hourlyGrid[0]?.energies.find((e) => e.task === task)
                  ?.dailyPct ?? 0;
              const isMainTask = task === mainTaskName;
              return (
                <div key={task} className={`text-center min-w-[60px] md:min-w-[70px] flex-1 ${isMainTask ? "ring-2 ring-energy-purple ring-offset-1 rounded-lg" : ""}`}>
                  <div
                    className={`rounded px-1 py-0.5 ${getSmallEnergyBgClass(dailyPct)}`}
                  >
                    <div className="font-bold text-xs md:text-sm">{dailyPct}%</div>
                  </div>
                  <div className="text-[9px] md:text-[10px] text-slate-500 mt-0.5 truncate font-medium">
                    {task}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter toggle */}
      <div className="flex items-center gap-2 shrink-0 px-1">
        <span className="text-xs text-slate-500 font-medium">Lọc:</span>
        <button
          onClick={() => setFilter("good")}
          className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            isGoodFilter
              ? "bg-energy-green text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          &gt;100%
        </button>
        <button
          onClick={() => setFilter("bad")}
          className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            !isGoodFilter
              ? "bg-energy-purple text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          ≤100%
        </button>
      </div>

      {/* Hourly grid table */}
      <div className="flex-1 overflow-auto min-h-0 bg-white rounded-lg border border-slate-200 shadow-sm">
        {filteredSlots.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm p-4 text-center">
            {isGoodFilter
              ? "Không có khung giờ nào có năng lượng tổng > 100% trong ngày này"
              : "Tất cả khung giờ đều có năng lượng tổng > 100%"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-separate border-spacing-0">
              <thead className="bg-slate-50 sticky top-0 z-20">
                <tr>
                  <th className="text-left text-xs md:text-sm text-slate-600 font-bold py-2 md:py-3 px-2 md:px-3 border-b border-slate-200 w-[90px] md:w-[120px] sticky left-0 bg-slate-50 z-10">
                    Giờ
                  </th>
                  {tasks.map((task) => {
                    const isMainTask = task === mainTaskName;
                    return (
                      <th
                        key={task}
                        className={`text-center text-[10px] md:text-xs font-bold py-2 md:py-3 px-0.5 md:px-1 border-b border-slate-200 ${isMainTask ? "text-energy-purple bg-energy-purple/5" : "text-slate-600"}`}
                      >
                        {task}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredSlots.map((slot) => {
                  const hasGood = slot.energies.some((e) => e.finalPct > 100);
                  const isBestHour = slot.timeSlot === dayData.bestHour;
                  return (
                    <tr
                      key={slot.timeSlot}
                      className={`${hasGood ? "bg-green-50/50" : ""} ${isBestHour ? "ring-2 ring-inset ring-energy-purple" : ""}`}
                    >
                      <td className={`py-1.5 md:py-2 px-2 md:px-3 border-b border-slate-100 sticky left-0 z-10 ${hasGood ? "bg-green-50" : "bg-white"} ${isBestHour ? "bg-energy-purple/10" : ""}`}>
                        <span
                          className={`inline-block px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold ${
                            isBestHour
                              ? "bg-energy-purple text-white"
                              : hasGood
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {slot.timeSlot}
                        </span>
                      </td>
                      {slot.energies.map((energy) => {
                        const isMainTask = energy.task === mainTaskName;
                        return (
                          <td
                            key={energy.task}
                            className={`py-1.5 md:py-2 px-0.5 md:px-1 border-b border-slate-100 ${isMainTask ? "bg-energy-purple/5" : ""}`}
                          >
                            {isGoodFilter && energy.finalPct <= 100 ? (
                              <div className="text-center text-xs text-slate-300">
                                —
                              </div>
                            ) : !isGoodFilter && energy.finalPct > 100 ? (
                              <div className="text-center text-xs text-slate-300">
                                —
                              </div>
                            ) : (
                              <EnergyCell energy={energy} />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
