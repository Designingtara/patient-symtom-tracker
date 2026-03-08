import { cn } from '@/lib/utils';
import { POSITIVE_FACTOR_GROUPS, EXERCISE_INTENSITIES } from '@/lib/constants';

interface Props {
  positiveFactors: string[];
  exerciseIntensity: string;
  onToggleFactor: (item: string) => void;
  onSetIntensity: (intensity: string) => void;
}

export default function GoodDayFactors({ positiveFactors, exerciseIntensity, onToggleFactor, onSetIntensity }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">What helped today?</h3>
      {Object.entries(POSITIVE_FACTOR_GROUPS).map(([group, items]) => (
        <div key={group}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">{group}</p>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onToggleFactor(item)}
                className={cn(
                  'min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  positiveFactors.includes(item)
                    ? 'bg-accent ring-2 ring-primary shadow-sm'
                    : 'bg-muted text-foreground hover:bg-accent/50'
                )}
                aria-pressed={positiveFactors.includes(item)}
              >
                {item}
              </button>
            ))}
          </div>
          {group === 'Exercise' && positiveFactors.includes('Exercise') && (
            <div className="mt-3 ml-2">
              <p className="text-xs text-muted-foreground mb-2">Intensity</p>
              <div className="flex gap-2">
                {EXERCISE_INTENSITIES.map((intensity) => (
                  <button
                    key={intensity}
                    type="button"
                    onClick={() => onSetIntensity(intensity)}
                    className={cn(
                      'min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      exerciseIntensity === intensity
                        ? 'bg-accent-sage ring-2 ring-primary shadow-sm'
                        : 'bg-muted text-foreground hover:bg-accent/50'
                    )}
                    aria-pressed={exerciseIntensity === intensity}
                  >
                    {intensity}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
