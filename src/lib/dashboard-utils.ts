import { subDays, parseISO, isAfter, startOfDay } from 'date-fns';
import type { LogEntry } from './types';

export type DateRange = '7' | '30' | '90' | 'all';
export type DayTypeFilter = 'all' | 'rough' | 'okay' | 'good';
export type SymptomTypeFilter = 'all' | 'physical' | 'mental';

import { PHYSICAL_SYMPTOMS, MENTAL_EMOTIONAL_SYMPTOMS } from './constants';

const physicalSet = new Set<string>(PHYSICAL_SYMPTOMS);
const mentalSet = new Set<string>(MENTAL_EMOTIONAL_SYMPTOMS);

export function filterEntries(
  entries: LogEntry[],
  range: DateRange,
  symptomType: SymptomTypeFilter,
  dayType: DayTypeFilter,
): LogEntry[] {
  const now = new Date();
  return entries.filter((e) => {
    // date range
    if (range !== 'all') {
      const cutoff = startOfDay(subDays(now, Number(range)));
      if (!isAfter(parseISO(e.date), cutoff) && parseISO(e.date).getTime() !== cutoff.getTime()) return false;
    }
    // day type
    if (dayType !== 'all' && e.dayType !== dayType) return false;
    // symptom type
    if (symptomType !== 'all' && e.symptoms) {
      const hasMatch = e.symptoms.some((s) =>
        symptomType === 'physical' ? physicalSet.has(s) : mentalSet.has(s),
      );
      if (!hasMatch && e.dayType !== 'good') return false;
    }
    return true;
  });
}

export function countByFrequency(items: string[]): { name: string; count: number }[] {
  const map = new Map<string, number>();
  items.forEach((i) => map.set(i, (map.get(i) || 0) + 1));
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getSummary(filtered: LogEntry[]) {
  const total = filtered.length;
  const goodDays = filtered.filter((e) => e.dayType === 'good').length;
  const withSeverity = filtered.filter((e) => e.severity !== null && e.severity !== undefined);
  const avgSeverity =
    withSeverity.length > 0
      ? (withSeverity.reduce((s, e) => s + (e.severity ?? 0), 0) / withSeverity.length).toFixed(1)
      : '—';

  // Most common symptom
  const allSymptoms = filtered.flatMap((e) => e.symptoms ?? []);
  const symptomFreq = countByFrequency(allSymptoms);
  const topSymptom = symptomFreq[0]?.name ?? '—';

  // Top helpful factor
  const allFactors = filtered.flatMap((e) => e.positiveFactors ?? []);
  const factorFreq = countByFrequency(allFactors);
  const topFactor = factorFreq[0]?.name ?? '—';

  return { total, goodDays, avgSeverity, topSymptom, topFactor };
}

export function entriesToCsv(entries: LogEntry[]): string {
  const headers = [
    'Date', 'Day Type', 'Severity', 'Categories', 'Symptoms',
    'Body Areas', 'Medication', 'Functional Impacts',
    'Positive Factors', 'Exercise Intensity', 'Notes',
  ];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = entries.map((e) => [
    e.date,
    e.dayType,
    e.severity ?? '',
    (e.category ?? []).join('; '),
    (e.symptoms ?? []).join('; '),
    (e.bodyAreas ?? []).map((b) => `${b.area} (${b.side})`).join('; '),
    e.medication ?? '',
    (e.functionalImpacts ?? []).join('; '),
    (e.positiveFactors ?? []).join('; '),
    e.exerciseIntensity ?? '',
    e.notes ?? '',
  ].map((v) => escape(String(v))).join(','));

  return [headers.join(','), ...rows].join('\n');
}
