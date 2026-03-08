import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, Tooltip as RechartsTooltip,
} from 'recharts';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { LogEntry } from '@/lib/types';
import {
  filterEntries, getSummary, countByFrequency, entriesToCsv,
  type DateRange, type DayTypeFilter, type SymptomTypeFilter,
} from '@/lib/dashboard-utils';

const DAY_COLORS: Record<string, string> = {
  rough: 'hsl(0 60% 50%)',
  okay: 'hsl(45 80% 55%)',
  good: 'hsl(145 45% 50%)',
};

export default function DashboardView() {
  const [entries] = useLocalStorage<LogEntry[]>('ebbi-entries', []);
  const [range, setRange] = useState<DateRange>('7');
  const [symptomType, setSymptomType] = useState<SymptomTypeFilter>('all');
  const [dayType, setDayType] = useState<DayTypeFilter>('all');

  const filtered = useMemo(
    () => filterEntries(entries, range, symptomType, dayType),
    [entries, range, symptomType, dayType],
  );

  const summary = useMemo(() => getSummary(filtered), [filtered]);

  // Chart data: severity over time, sorted by date
  const chartData = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date));
    return sorted.map((e) => ({
      date: format(parseISO(e.date), 'MMM d'),
      severity: e.dayType === 'good' ? 0 : (e.severity ?? null),
      dayType: e.dayType,
      fill: DAY_COLORS[e.dayType],
    }));
  }, [filtered]);

  // Positive factors bar chart (from good days in filtered set)
  const factorData = useMemo(() => {
    const goodEntries = filtered.filter((e) => e.dayType === 'good');
    const allFactors = goodEntries.flatMap((e) => e.positiveFactors ?? []);
    return countByFrequency(allFactors).slice(0, 6);
  }, [filtered]);

  // Sorted entries for list (most recent first)
  const sortedEntries = useMemo(
    () => [...filtered].sort((a, b) => b.date.localeCompare(a.date)),
    [filtered],
  );

  const handleExport = () => {
    const csv = entriesToCsv(sortedEntries);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ebbi-entries-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button
          onClick={handleExport}
          disabled={filtered.length === 0}
          variant="outline"
          className="min-h-[44px] gap-2"
          aria-label="Share with doctor — export CSV"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Share with doctor
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex gap-3 flex-wrap" role="group" aria-label="Filters">
        <Select value={range} onValueChange={(v) => setRange(v as DateRange)}>
          <SelectTrigger className="w-[140px] min-h-[44px]" aria-label="Date range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>

        <Select value={symptomType} onValueChange={(v) => setSymptomType(v as SymptomTypeFilter)}>
          <SelectTrigger className="w-[150px] min-h-[44px]" aria-label="Symptom type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All symptoms</SelectItem>
            <SelectItem value="physical">Physical</SelectItem>
            <SelectItem value="mental">Mental-emotional</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dayType} onValueChange={(v) => setDayType(v as DayTypeFilter)}>
          <SelectTrigger className="w-[130px] min-h-[44px]" aria-label="Day type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All days</SelectItem>
            <SelectItem value="rough">Rough</SelectItem>
            <SelectItem value="okay">Okay</SelectItem>
            <SelectItem value="good">Good</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Entries', value: String(summary.total) },
          { label: 'Avg severity', value: summary.avgSeverity },
          { label: 'Good days', value: String(summary.goodDays) },
          { label: 'Top symptom', value: summary.topSymptom },
          { label: 'Top helper', value: summary.topFactor },
        ].map((item) => (
          <Card key={item.label} className="shadow-sm">
            <CardContent className="pt-4 text-center">
              <p className="text-xl font-bold text-primary truncate" title={item.value}>
                {item.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Severity chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Severity over time</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No data yet — start logging to see trends
            </p>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <RechartsTooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="severity"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (cx == null || cy == null) return <></>;
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={4}
                          fill={DAY_COLORS[payload.dayType]}
                          stroke="hsl(var(--card))"
                          strokeWidth={2}
                        />
                      );
                    }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Positive factors chart */}
      {factorData.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">What helps on good days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={factorData} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                    width={120}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entry list */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Recent entries</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your logged entries will appear here.</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {sortedEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {format(parseISO(entry.date), 'EEE, MMM d')}
                    </span>
                    <div className="flex items-center gap-2">
                      {entry.severity !== null && entry.severity !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          Severity {entry.severity}/10
                        </span>
                      )}
                      <Badge
                        variant="secondary"
                        className="text-xs capitalize"
                        style={{ backgroundColor: DAY_COLORS[entry.dayType], color: '#fff' }}
                      >
                        {entry.dayType}
                      </Badge>
                    </div>
                  </div>
                  {(entry.symptoms?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.symptoms!.map((s) => (
                        <Badge key={s} variant="outline" className="text-xs font-normal">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {(entry.functionalImpacts?.length ?? 0) > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Effort needed: {entry.functionalImpacts!.join(', ')}
                    </p>
                  )}
                  {entry.notes && (
                    <p className="text-xs text-muted-foreground italic mt-1">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
