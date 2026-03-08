import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';

interface Props {
  mood: string | null;
  isGoodDay: boolean;
  severity: number[];
}

export default function SpeakButton({ mood, isGoodDay, severity }: Props) {
  const { speak, stop, speaking, supported } = useSpeechSynthesis();

  if (!supported) return null;

  const handleClick = () => {
    if (speaking) {
      stop();
      return;
    }

    const parts: string[] = [
      'Log your day.',
      'First, choose a date.',
      'Then select how your day was: Rough day, Okay day, or Good day.',
    ];

    if (mood && !isGoodDay) {
      parts.push(`You selected ${mood}.`);
      parts.push(`Severity is set to ${severity[0]} out of 10.`);
      parts.push('You can add more detail like symptoms, body areas, and medication.');
      parts.push('You can also note what needed extra effort today.');
    } else if (isGoodDay) {
      parts.push('You selected Good day.');
      parts.push('You can note what helped today, like treatment, rest, or exercise.');
    }

    parts.push('Add optional notes, then tap Save.');
    speak(parts.join(' '));
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="min-h-[44px] min-w-[44px]"
      aria-label={speaking ? 'Stop reading aloud' : 'Read form instructions aloud'}
      aria-pressed={speaking}
    >
      {speaking ? (
        <VolumeX className="h-5 w-5 text-primary" />
      ) : (
        <Volume2 className="h-5 w-5 text-muted-foreground" />
      )}
    </Button>
  );
}
