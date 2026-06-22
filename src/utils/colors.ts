// Energy level to background color class
export function getEnergyBgClass(pct: number): string {
  if (pct > 100) return "bg-energy-green text-white";
  if (pct >= 80) return "bg-energy-yellow text-slate-900";
  if (pct >= 60) return "bg-energy-orange text-white";
  if (pct >= 40) return "bg-energy-red text-white";
  return "bg-energy-purple text-white";
}

// For daily/hourly individual values (smaller threshold)
export function getSmallEnergyBgClass(pct: number): string {
  if (pct >= 75) return "bg-energy-green text-white";
  if (pct > 50) return "bg-energy-yellow text-slate-900";
  if (pct > 35) return "bg-energy-red text-white";
  return "bg-energy-purple text-white";
}

// Border color based on energy
export function getEnergyBorderClass(pct: number): string {
  if (pct > 100) return "border-energy-green";
  if (pct >= 80) return "border-energy-yellow";
  if (pct >= 60) return "border-energy-orange";
  if (pct >= 40) return "border-energy-red";
  return "border-energy-purple";
}

// Text color based on energy
export function getEnergyTextClass(pct: number): string {
  if (pct > 100) return "text-energy-green";
  if (pct >= 80) return "text-energy-yellow";
  if (pct >= 60) return "text-energy-orange";
  if (pct >= 40) return "text-energy-red";
  return "text-energy-purple";
}
