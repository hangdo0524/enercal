import type { EnergyCell as EnergyData } from "../types";
import { getEnergyBgClass, getSmallEnergyBgClass } from "../utils/colors";

interface EnergyCellProps {
  energy: EnergyData;
}

export function EnergyCell({ energy }: EnergyCellProps) {
  const isGood = energy.finalPct > 100;
  const bgClass = getEnergyBgClass(energy.finalPct);

  return (
    <div
      className={`rounded-md md:rounded-lg px-1 md:px-2 py-1 md:py-1.5 text-[10px] md:text-xs leading-tight ${bgClass} ${
        isGood ? "ring-2 ring-yellow-300 shadow-md" : "opacity-80"
      } flex items-center justify-between gap-0.5 md:gap-1`}
    >
      <div className="font-bold text-sm md:text-base">{energy.finalPct}%</div>
      <div className="flex flex-col text-[8px] md:text-[10px] font-semibold text-right">
        <span>
          D=
          <span
            className={`inline-block px-0.5 rounded ${getSmallEnergyBgClass(energy.dailyPct)}`}
          >
            {energy.dailyPct}
          </span>
        </span>
        <span>
          H=
          <span
            className={`inline-block px-0.5 rounded ${getSmallEnergyBgClass(energy.hourlyVal)}`}
          >
            {energy.hourlyVal}
          </span>
        </span>
      </div>
    </div>
  );
}
