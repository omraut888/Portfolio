export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function formatNumber(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(0)}B+`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M+`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K+`;
  return `${n}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
