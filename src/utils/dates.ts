export const WEEKDAYS_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getWeekDates(dateStr: string): string[] {
  const d = parseDate(dateStr);
  const dayOfWeek = d.getDay();
  const startOfWeek = new Date(d);
  startOfWeek.setDate(d.getDate() - dayOfWeek);

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const curr = new Date(startOfWeek);
    curr.setDate(startOfWeek.getDate() + i);
    dates.push(formatDateStr(curr));
  }
  return dates;
}

export function getMonthGrid(dateStr: string): (string | null)[][] {
  const d = parseDate(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks: (string | null)[][] = [];
  let week: (string | null)[] = new Array(firstDayOfMonth).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    week.push(dateStr);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }

  return weeks;
}

export function navigateMonth(dateStr: string, delta: number): string {
  const d = parseDate(dateStr);
  d.setMonth(d.getMonth() + delta);
  d.setDate(1);
  return formatDateStr(d);
}

export function navigateWeek(dateStr: string, delta: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + delta * 7);
  return formatDateStr(d);
}

export function formatMonthYear(dateStr: string): string {
  const d = parseDate(dateStr);
  return d.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
}

export function getTodayStr(): string {
  return formatDateStr(new Date());
}
