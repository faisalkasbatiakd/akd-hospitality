/**
 * Tints for icon chips.
 *
 * Applied only to small icon badges, never to type or surfaces, so the page
 * keeps its blue identity while the icons themselves carry some colour. Cycle
 * through these with `iconTint(index)` so a row of cards varies predictably
 * instead of every icon being the same flat blue.
 */
export const iconTints = [
  "bg-blue-50 text-blue-600",
  "bg-indigo-50 text-indigo-600",
  "bg-sky-50 text-sky-600",
  "bg-teal-50 text-teal-600",
  "bg-amber-50 text-amber-600",
  "bg-slate-100 text-slate-600",
] as const;

export function iconTint(index: number) {
  return iconTints[index % iconTints.length];
}
