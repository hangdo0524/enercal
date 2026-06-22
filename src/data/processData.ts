import type {
  RawProfile,
  RawEnergyData,
  ProcessedProfile,
  ProcessedDayData,
  ProcessedHourlySlot,
  EnergyCell,
} from "../types";
import { ENERGY_TASKS, TIME_SLOTS } from "../types";
import energyData from "./energyData.json";

export function processRawProfile(profile: RawProfile): ProcessedProfile {
  const processedDays: Record<string, ProcessedDayData> = {};

  for (const [dateStr, dayData] of Object.entries(profile.days)) {
    const dailyValues = dayData.dailyValues;
    const hourlyGridRaw = dayData.hourlyGrid;

    // Step 1: Find main task based on highest DAILY value
    let mainTaskName = "";
    let mainTaskDailyPct = 0;
    for (const task of ENERGY_TASKS) {
      const dailyPct = dailyValues[task] ?? 0;
      if (dailyPct > mainTaskDailyPct) {
        mainTaskDailyPct = dailyPct;
        mainTaskName = task;
      }
    }

    // Step 2: Process hourly grid
    const processedHourlyGrid: ProcessedHourlySlot[] = TIME_SLOTS.map(
      (timeSlot, slotIndex) => {
        const energies: EnergyCell[] = ENERGY_TASKS.map((task) => {
          const dailyPct = dailyValues[task] ?? 0;
          const hourlyVal = hourlyGridRaw[task]?.[slotIndex] ?? 0;
          const finalPct = dailyPct + hourlyVal;
          return { task, dailyPct, hourlyVal, finalPct };
        });
        return { timeSlot, energies };
      }
    );

    // Step 3: Find best hour for the main task (highest final % for that task)
    let bestHourForMainTask = "";
    let bestFinalPctForMainTask = 0;
    for (const slot of processedHourlyGrid) {
      const mainTaskEnergy = slot.energies.find((e) => e.task === mainTaskName);
      if (mainTaskEnergy && mainTaskEnergy.finalPct > bestFinalPctForMainTask) {
        bestFinalPctForMainTask = mainTaskEnergy.finalPct;
        bestHourForMainTask = slot.timeSlot;
      }
    }

    processedDays[dateStr] = {
      date: dateStr,
      mainTask: `Ngày ${mainTaskName}`,
      mainTaskDailyPct,
      bestHour: bestHourForMainTask,
      topPct: bestFinalPctForMainTask,
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
