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

// Numerology types
export interface NumerologyNumber {
  number: number;
  calculation?: string;
  meaning: string;
  masterInfluence?: string | null;
  traits?: {
    positive: string[];
    negative: string[];
  };
}

export interface ThreePillars {
  tam: { score: number; maxScore: number; analysis: string };
  tri: { score: number; maxScore: number; analysis: string };
  luc: { score: number; maxScore: number; analysis: string };
}

export interface PersonalYearNumber {
  number: number;
  chuDe: string;
  laSoChu?: boolean;
}

export interface DualPersonalYear {
  ghiChu?: string;
  theoNgaySinhThuc: {
    note?: string;
    [year: string]: { number: number; chuDe: string; laSoChu?: boolean } | string | undefined;
  };
  theoNgayKhaiSinh?: {
    note?: string;
    [year: string]: { number: number; chuDe: string; laSoChu?: boolean } | string | undefined;
  };
  ketHop?: string;
}

export type PersonalYearData = Record<string, PersonalYearNumber> | DualPersonalYear;

export interface ChallengeNumber {
  number: number;
  congThuc: string;
  yNghia: string;
}

export interface ChallengeNumbers {
  theoNgaySinhThuc?: {
    date: string;
    congThuc: string;
    thuThach1: ChallengeNumber;
    thuThach2: ChallengeNumber;
    thuThach3: ChallengeNumber;
    thuThach4: ChallengeNumber;
  };
  theoNgayKhaiSinh?: {
    date: string;
    congThuc: string;
    thuThach1: ChallengeNumber;
    thuThach2: ChallengeNumber;
    thuThach3: ChallengeNumber;
    thuThach4: ChallengeNumber;
  };
  congThuc?: string;
  thuThach1?: ChallengeNumber;
  thuThach2?: ChallengeNumber;
  thuThach3?: ChallengeNumber;
  thuThach4?: ChallengeNumber;
  phanTich?: string;
  phanTichKetHop?: string;
}

export interface MissingNumbers {
  congThuc: string;
  cacSoThieu: number[];
  phanTich: Record<string, string>;
  ghiChu?: string;
}

export interface PersonalPortrait {
  tieuDe: string;
  moTa: string[];
  thongDiepChinh: string;
  dieuCanLuuY: string[];
}

export interface PersonalRoadmapPhase {
  nam: string;
  soNamCaNhan: number | { thuc: number; khaiSinh: number };
  tuoi?: string;
  chuDe: string;
  moTa: string;
  hanhDong: string[];
  laSoChu?: boolean;
  mucTieuCuoiNam: {
    tam: string;
    tri: string;
    luc: string;
  };
}

export interface PersonalRoadmap {
  tamNhin: string;
  chuKy?: string;
  chuKyHienTai?: {
    theoNgayThuc: string;
    theoNgayKhaiSinh: string;
  };
  tuoi?: string;
  cacGiaiDoan: PersonalRoadmapPhase[];
}

export interface NumerologyPerson {
  id: string;
  name: string;
  role: string;
  birthDate: {
    official: string;
    actual?: string;
    used: string;
  };
  coreNumbers: {
    byActualBirthDate?: {
      date: string;
      note: string;
      lifePath: NumerologyNumber;
      birthdayNumber: { number: number; meaning: string };
    };
    byOfficialBirthDate?: {
      date: string;
      note: string;
      lifePath: NumerologyNumber;
      birthdayNumber: { number: number; meaning: string };
    };
    dualDateAnalysis?: {
      summary: string;
      interpretation: {
        innerSelf: { numbers: string; description: string };
        outerSelf: { numbers: string; description: string };
        conflict: { description: string; currentState: string; solution: string };
      };
    };
    lifePath?: NumerologyNumber;
    birthdayNumber?: { number: number; reducedTo?: number; meaning: string; masterNumber?: boolean };
    expressionNumber: { number: number; calculation: string; meaning: string };
    soulUrge: { number: number; calculation: string; meaning: string };
    personalityNumber?: { number: number; calculation: string; meaning: string; note?: string };
    maturityNumber?: {
      number: number;
      calculation: string;
      meaning: string;
      note?: string;
    } | {
      ghiChu?: string;
      theoNgaySinhThuc: { congThuc: string; number: number; yNghia: string; chiTiet?: string };
      theoNgayKhaiSinh?: { congThuc: string; number: number; yNghia: string; chiTiet?: string };
      ketHop?: string;
    };
    personalYear?: PersonalYearData;
    challengeNumbers?: ChallengeNumbers;
    missingNumbers?: MissingNumbers;
  };
  threePillars: ThreePillars;
  currentChallenges: string[];
  unlockPotential: string[];
  idealModel: {
    tam: string;
    tri: string;
    luc: string;
  };
  personalPortrait?: PersonalPortrait;
  personalRoadmap?: PersonalRoadmap;
  numerologyGuidance?: any;
  specificSuggestions?: any;
}

export interface RoadmapPhase {
  period: string;
  theme: string;
  priorityMember: {
    id: string;
    secondary?: string;
    reason: string;
  };
  focusTraits?: string[];
  actions: Record<string, string[]>;
  recognition?: Record<string, string>;
  evaluation?: {
    metrics: string[];
    checkpointWeeks?: number[];
  };
  milestones?: Record<string, { tam: string; tri: string; luc: string }>;
}

export interface FamilyAnalysis {
  familyLifePath: {
    calculation: string;
    number: number;
    meaning: string;
    familyMission: string;
  };
  numberDistribution: {
    dominant: number[];
    pattern: string;
    significance: string;
  };
  masterNumbersInFamily: {
    count: number;
    details: string[];
    significance: string;
  };
  complementaryDynamics: {
    strengths: { pair: string; dynamic: string }[];
    tensions: { pair: string; tension: string; solution: string }[];
  };
}

export interface SupportMatrix {
  supporter: string;
  supports: { receiver: string; how: string }[];
}

export interface NumerologyData {
  metadata: {
    createdAt: string;
    version: string;
    calculationMethod: string;
    terminology?: any;
  };
  individuals: NumerologyPerson[];
  familyAnalysis: FamilyAnalysis;
  familyRoadmap2026_2030: {
    vision: string;
    phases: RoadmapPhase[];
  };
  supportMatrix: {
    description: string;
    matrix: SupportMatrix[];
  };
  recognitionGuide: {
    principle: string;
    byPerson: {
      person: string;
      rightWay: string[];
      avoid: string[];
    }[];
  };
}
