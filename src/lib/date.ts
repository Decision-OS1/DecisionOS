export function toDateKey(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

export function daysBetween(earlierKey: string, laterKey: string) {
  const oneDayMs = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(laterKey) - Date.parse(earlierKey)) / oneDayMs);
}
