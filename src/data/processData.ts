import type {
  RawProfile,
  RawEnergyData,
  ProcessedProfile,
  ProcessedDayData,
  ProcessedHourlySlot,
  EnergyCell,
  EnergyTask,
  TimeSlot,
} from "../types";
import { ENERGY_TASKS, TIME_SLOTS } from "../types";
import energyData from "./energyData.json";

export function processRawProfile(profile: RawProfile): ProcessedProfile {
  const processedDays: Record<string, ProcessedDayData> = {};

  for (const [dateStr, dayData] of Object.entries(profile.days)) {
    const dailyValues = dayData.dailyValues;
    const hourlyGridRaw = dayData.hourlyGrid;

    // Find main task (from mainTheme or highest daily value)
    let mainTask = dayData.mainTheme || "";
    if (!mainTask) {
      let maxPct = 0;
      for (const task of ENERGY_TASKS) {
        const val = dailyValues[task] ?? 0;
        if (val > maxPct) {
          maxPct = val;
          mainTask = `Ngày ${task}`;
        }
      }
    }

    // Process hourly grid
    let topPct = 0;
    const processedHourlyGrid: ProcessedHourlySlot[] = TIME_SLOTS.map(
      (timeSlot, slotIndex) => {
        const energies: EnergyCell[] = ENERGY_TASKS.map((task) => {
          const dailyPct = dailyValues[task] ?? 0;
          const hourlyVal = hourlyGridRaw[task]?.[slotIndex] ?? 0;
          const finalPct = dailyPct + hourlyVal;

          if (finalPct > topPct) {
            topPct = finalPct;
          }

          return { task, dailyPct, hourlyVal, finalPct };
        });

        return { timeSlot, energies };
      }
    );

    processedDays[dateStr] = {
      date: dateStr,
      mainTask,
      topPct,
      hourlyGrid: processedHourlyGrid,
    };
  }

  return {
    id: profile.id,
    name: profile.name,
    days: processedDays,
  };
}

export function loadAndProcessProfiles(): ProcessedProfile[] {
  const data = energyData as RawEnergyData;
  return data.profiles.map(processRawProfile);
}
