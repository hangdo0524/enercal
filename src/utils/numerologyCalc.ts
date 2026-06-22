// Numerology calculation utilities

// Reduce a number to single digit (except master numbers 11, 22, 33)
export function reduceToSingleDigit(num: number, keepMaster = true): number {
  while (num > 9) {
    if (keepMaster && (num === 11 || num === 22 || num === 33)) {
      return num;
    }
    num = String(num).split('').reduce((sum, d) => sum + parseInt(d), 0);
  }
  return num;
}

// Parse date string "DD/MM/YYYY" to components
export function parseDateString(dateStr: string): { day: number; month: number; year: number } | null {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  return {
    day: parseInt(parts[0]),
    month: parseInt(parts[1]),
    year: parseInt(parts[2])
  };
}

// Calculate Life Path number from date
export function calculateLifePath(dateStr: string): number {
  const date = parseDateString(dateStr);
  if (!date) return 0;

  const daySum = reduceToSingleDigit(date.day, false);
  const monthSum = reduceToSingleDigit(date.month, false);
  const yearSum = reduceToSingleDigit(date.year, false);

  return reduceToSingleDigit(daySum + monthSum + yearSum);
}

export interface Pinnacle {
  number: number;
  startAge: number;
  endAge: number | null; // null means "rest of life"
  phase: 1 | 2 | 3 | 4;
}

// Calculate Pinnacles from birth date
export function calculatePinnacles(dateStr: string): Pinnacle[] {
  const date = parseDateString(dateStr);
  if (!date) return [];

  const lifePath = calculateLifePath(dateStr);

  // Reduce components (not keeping master for calculation)
  const dayNum = reduceToSingleDigit(date.day, false);
  const monthNum = reduceToSingleDigit(date.month, false);
  const yearNum = reduceToSingleDigit(date.year, false);

  // Calculate pinnacle numbers
  const p1 = reduceToSingleDigit(monthNum + dayNum);
  const p2 = reduceToSingleDigit(dayNum + yearNum);
  const p3 = reduceToSingleDigit(p1 + p2);
  const p4 = reduceToSingleDigit(monthNum + yearNum);

  // Calculate ages
  const firstPinnacleEnd = 36 - lifePath;

  return [
    {
      number: p1,
      startAge: 0,
      endAge: firstPinnacleEnd,
      phase: 1 as const
    },
    {
      number: p2,
      startAge: firstPinnacleEnd + 1,
      endAge: firstPinnacleEnd + 9,
      phase: 2 as const
    },
    {
      number: p3,
      startAge: firstPinnacleEnd + 10,
      endAge: firstPinnacleEnd + 18,
      phase: 3 as const
    },
    {
      number: p4,
      startAge: firstPinnacleEnd + 19,
      endAge: null,
      phase: 4 as const
    }
  ];
}

// Calculate current age from birth year
export function calculateAge(birthYear: number): number {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

// Get current pinnacle based on age
export function getCurrentPinnacle(pinnacles: Pinnacle[], age: number): Pinnacle | null {
  for (const p of pinnacles) {
    if (age >= p.startAge && (p.endAge === null || age <= p.endAge)) {
      return p;
    }
  }
  return null;
}
