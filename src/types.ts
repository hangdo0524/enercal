export type EnergyTask =
  | "Sức khỏe"
  | "Học tập"
  | "Công việc"
  | "Gia đình"
  | "Thời cơ"
  | "Quan hệ"
  | "Đầu tư"
  | "Tâm linh";

export const ENERGY_TASKS: EnergyTask[] = [
  "Sức khỏe",
  "Học tập",
  "Công việc",
  "Gia đình",
  "Thời cơ",
  "Quan hệ",
  "Đầu tư",
  "Tâm linh",
];

export const TIME_SLOTS = [
  "0-1-2 H",
  "3-4-5 H",
  "6-7-8 H",
  "9-10-11 H",
  "12-13-14 H",
  "15-16-17 H",
  "18-19-20 H",
  "21-22-23 H",
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];

// Raw data from JSON
export interface RawDayData {
  date: string;
  mainTheme: string;
  dailyValues: Record<string, number>;
  hourlyGrid: Record<string, number[]>;
}

export interface RawProfile {
  id: string;
  name: string;
  days: Record<string, RawDayData>;
}

export interface RawEnergyData {
  profiles: RawProfile[];
}

// Processed data for display
export interface EnergyCell {
  task: EnergyTask;
  dailyPct: number;
  hourlyVal: number;
  finalPct: number;
}

export interface ProcessedHourlySlot {
  timeSlot: TimeSlot;
  energies: EnergyCell[];
}

export interface ProcessedDayData {
  date: string;
  mainTask: string;
  mainTaskDailyPct: number;
  bestHour: string;
  topPct: number;
  hourlyGrid: ProcessedHourlySlot[];
}

export interface ProcessedProfile {
  id: string;
  name: string;
  days: Record<string, ProcessedDayData>;
}
