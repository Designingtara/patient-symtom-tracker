import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface Props {
  severity: number[];
  onChange: (v: number[]) => void;
}

export default function SeveritySlider({ severity, onChange }: Props) {
  return (
    <div>
      <Label className="text-sm font-medium mb-3 block">
        Severity: {severity[0]}/10
      </Label>
      <div className="px-1">
        <Slider
          value={severity}
          onValueChange={onChange}
          min={0}
          max={10}
          step={1}
          className="w-full"
          aria-label="Severity level"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Manageable</span>
          <span>Severe</span>
        </div>
      </div>
    </div>
  );
}
