import { cn } from '@/lib/utils';
import type { SymptomProfile } from '@/lib/types';

interface Props {
  profiles: SymptomProfile[];
  onApply: (profile: SymptomProfile) => void;
}

export default function ProfileBar({ profiles, onApply }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {profiles.map((profile) => (
        <button
          key={profile.id}
          type="button"
          onClick={() => onApply(profile)}
          className={cn(
            'min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium transition-all',
            'bg-accent-sage text-foreground hover:bg-accent-sage/80',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
        >
          {profile.name}
        </button>
      ))}
    </div>
  );
}
