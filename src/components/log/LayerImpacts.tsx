import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FUNCTIONAL_IMPACTS } from '@/lib/constants';

interface Props {
  show: boolean;
  onToggle: () => void;
  functionalImpacts: string[];
  onToggleImpact: (impact: string) => void;
}

export default function LayerImpacts({ show, onToggle, functionalImpacts, onToggleImpact }: Props) {
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-4">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-between min-h-[44px] text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-2"
          aria-expanded={show}
        >
          <span>What needed extra effort today?</span>
          {show ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {show && (
          <div className="mt-4 space-y-3">
            {FUNCTIONAL_IMPACTS.map((impact) => (
              <div key={impact} className="flex items-center min-h-[44px]">
                <Checkbox
                  id={`impact-${impact}`}
                  checked={functionalImpacts.includes(impact)}
                  onCheckedChange={() => onToggleImpact(impact)}
                  className="min-h-[20px] min-w-[20px]"
                />
                <Label htmlFor={`impact-${impact}`} className="ml-3 text-sm cursor-pointer">
                  {impact}
                </Label>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
