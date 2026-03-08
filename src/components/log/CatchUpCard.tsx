import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SeveritySlider from './SeveritySlider';
import ConfirmationToast from './ConfirmationToast';
import type { LogEntry, SymptomProfile } from '@/lib/types';

interface CatchUpCardProps {
  topSymptoms: string[];
  profiles: SymptomProfile[];
  onDismiss: () => void;
  onSave: (data: { symptoms: string[]; severity: number; dayType: 'rough' | 'okay' }) => void;
}

export default function CatchUpCard({ topSymptoms, profiles, onDismiss, onSave }: CatchUpCardProps) {
  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [severity, setSeverity] = useState([5]);

  const toggleSymptom = (s: string) => {
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const applyProfile = (profile: SymptomProfile) => {
    const merged = new Set([...selected, ...profile.symptoms]);
    setSelected(Array.from(merged));
  };

  const handleSave = () => {
    onSave({
      symptoms: selected,
      severity: severity[0],
      dayType: severity[0] <= 4 ? 'okay' : 'rough',
    });
  };

  if (!started) {
    return (
      <Card className="shadow-sm border-accent-teal/40">
        <CardContent className="pt-6 space-y-4 text-center">
          <p className="text-lg font-medium text-heading-green">
            Welcome back
          </p>
          <p className="text-foreground/80">
            No pressure — want to do a quick check-in?
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => setStarted(true)}
              className="min-h-[44px] bg-accent-sage hover:bg-accent-sage/80 text-foreground font-semibold"
              aria-label="Start a quick check-in"
            >
              Quick check-in
            </Button>
            <Button
              variant="outline"
              onClick={onDismiss}
              className="min-h-[44px]"
              aria-label="Dismiss catch-up prompt"
            >
              Not now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6 space-y-6">
        <p className="text-sm text-foreground/70">
          Tap what you're experiencing, adjust severity, and save.
        </p>

        {/* Symptom Profiles */}
        {profiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-heading-green">Quick profiles</p>
            <div className="flex flex-wrap gap-2">
              {profiles.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyProfile(p)}
                  className={cn(
                    'min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    'bg-accent-sage text-foreground hover:bg-accent-sage/80',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                  )}
                  aria-label={`Apply ${p.name} profile`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Top symptoms */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-heading-green">Your frequent symptoms</p>
          <div className="flex flex-wrap gap-2">
            {topSymptoms.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSymptom(s)}
                className={cn(
                  'min-h-[44px] px-4 py-2 rounded-full text-sm font-medium transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  selected.includes(s)
                    ? 'bg-accent-teal text-foreground ring-1 ring-accent-teal/60'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                )}
                aria-pressed={selected.includes(s)}
                aria-label={s}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <SeveritySlider severity={severity} onChange={setSeverity} />

        <Button
          onClick={handleSave}
          className="w-full min-h-[44px] bg-accent hover:bg-accent/80 text-foreground font-semibold"
          aria-label="Save quick check-in"
        >
          Save
        </Button>
      </CardContent>
    </Card>
  );
}
