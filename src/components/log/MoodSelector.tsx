import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { MOOD_OPTIONS } from '@/lib/constants';
import type { MoodOption } from '@/lib/constants';

const moodStyles: Record<MoodOption, string> = {
  'Rough day': 'bg-secondary text-foreground border-2 border-secondary',
  'Okay day': 'bg-accent text-foreground border-2 border-accent',
  'Good day': 'bg-accent-sage text-foreground border-2 border-accent-sage',
};

const moodActiveStyles: Record<MoodOption, string> = {
  'Rough day': 'bg-secondary ring-2 ring-primary border-2 border-primary shadow-md',
  'Okay day': 'bg-accent ring-2 ring-primary border-2 border-primary shadow-md',
  'Good day': 'bg-accent-sage ring-2 ring-primary border-2 border-primary shadow-md',
};

interface Props {
  mood: MoodOption | null;
  onSelect: (mood: MoodOption) => void;
}

export default function MoodSelector({ mood, onSelect }: Props) {
  return (
    <div>
      <Label className="text-sm font-medium mb-3 block">How was your day?</Label>
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Day mood">
        {MOOD_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={mood === option}
            onClick={() => onSelect(option)}
            className={cn(
              'min-h-[44px] rounded-lg px-3 py-3 text-sm font-medium transition-all text-center',
              mood === option ? moodActiveStyles[option] : moodStyles[option],
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
