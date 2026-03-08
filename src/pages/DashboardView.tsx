import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const placeholderData = [
  { day: 'Mon', severity: null },
  { day: 'Tue', severity: null },
  { day: 'Wed', severity: null },
  { day: 'Thu', severity: null },
  { day: 'Fri', severity: null },
  { day: 'Sat', severity: null },
  { day: 'Sun', severity: null },
];

export default function DashboardView() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Filter bar */}
      <div className="flex gap-3 flex-wrap">
        <Select>
          <SelectTrigger className="w-[160px] min-h-[44px]" aria-label="Date range">
            <SelectValue placeholder="This week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
            <SelectItem value="3months">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[160px] min-h-[44px]" aria-label="Symptom type">
            <SelectValue placeholder="All symptoms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All symptoms</SelectItem>
            <SelectItem value="physical">Physical</SelectItem>
            <SelectItem value="mental">Mental-emotional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Severity over time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={placeholderData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Line type="monotone" dataKey="severity" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-2">No data yet — start logging to see trends</p>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Entries this week', value: '—' },
          { label: 'Average severity', value: '—' },
          { label: 'Good days this week', value: '—' },
        ].map((item) => (
          <Card key={item.label} className="shadow-sm">
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-primary">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Entry list placeholder */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Recent entries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Your logged entries will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
