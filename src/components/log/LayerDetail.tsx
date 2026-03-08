import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import {
  PHYSICAL_SYMPTOMS, MENTAL_EMOTIONAL_SYMPTOMS,
  BODY_AREAS, BODY_SIDES, MEDICATION_OPTIONS, SYMPTOM_CATEGORIES,
} from '@/lib/constants';
import type { BodyAreaEntry, AppSettings } from '@/lib/types';

interface Props {
  show: boolean;
  onToggle: () => void;
  settings: AppSettings;
  categories: string[];
  symptoms: string[];
  bodyAreas: BodyAreaEntry[];
  medication: string;
  onToggleCategory: (cat: string) => void;
  onToggleSymptom: (sym: string) => void;
  onToggleBodyArea: (area: string, side: string) => void;
  onSetMedication: (med: string) => void;
}

export default function LayerDetail({
  show, onToggle, settings, categories, symptoms, bodyAreas, medication,
  onToggleCategory, onToggleSymptom, onToggleBodyArea, onSetMedication,
}: Props) {
  const filteredSymptoms = () => {
    let result: readonly string[] = [];
    if (categories.includes('Physical')) result = [...result, ...PHYSICAL_SYMPTOMS];
    if (categories.includes('Mental-emotional')) result = [...result, ...MENTAL_EMOTIONAL_SYMPTOMS];
    if (categories.length === 0) result = [...PHYSICAL_SYMPTOMS, ...MENTAL_EMOTIONAL_SYMPTOMS];
    return result;
  };

  // Check if any layer 2 fields are enabled
  const hasVisibleFields = settings.showCategories || settings.showSymptoms || settings.showBodyAreas || settings.showMedication;
  if (!hasVisibleFields) return null;

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-4">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-between min-h-[44px] text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-2"
          aria-expanded={show}
        >
          <span>Add detail</span>
          {show ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {show && (
          <div className="mt-4 space-y-6">
            {/* Category toggles */}
            {settings.showCategories && (
              <div>
                <Label className="text-sm font-medium mb-3 block">Category</Label>
                <div className="flex gap-2">
                  {SYMPTOM_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onToggleCategory(cat)}
                      className={cn(
                        'min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        categories.includes(cat)
                          ? 'bg-accent ring-2 ring-primary shadow-sm'
                          : 'bg-muted text-foreground hover:bg-accent/50'
                      )}
                      aria-pressed={categories.includes(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Symptom type selector */}
            {settings.showSymptoms && (
              <div>
                <Label className="text-sm font-medium mb-3 block">Symptoms</Label>
                <div className="flex flex-wrap gap-2">
                  {filteredSymptoms().map((symptom) => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => onToggleSymptom(symptom)}
                      className={cn(
                        'min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-all',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        symptoms.includes(symptom)
                          ? 'bg-accent ring-2 ring-primary shadow-sm'
                          : 'bg-muted text-foreground hover:bg-accent/50'
                      )}
                      aria-pressed={symptoms.includes(symptom)}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Body area selector */}
            {settings.showBodyAreas && (
              <div>
                <Label className="text-sm font-medium mb-3 block">Body area</Label>
                <div className="space-y-2">
                  {BODY_AREAS.map((area) => {
                    const selected = bodyAreas.find(b => b.area === area);
                    return (
                      <div key={area} className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm min-w-[90px]">{area}</span>
                        {BODY_SIDES.map((side) => (
                          <button
                            key={side}
                            type="button"
                            onClick={() => onToggleBodyArea(area, side)}
                            className={cn(
                              'min-h-[44px] min-w-[44px] px-3 py-1 rounded-lg text-xs font-medium transition-all',
                              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                              selected?.side === side
                                ? 'bg-accent ring-2 ring-primary shadow-sm'
                                : 'bg-muted text-foreground hover:bg-accent/50'
                            )}
                            aria-pressed={selected?.side === side}
                          >
                            {side}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Medication need */}
            {settings.showMedication && (
              <div>
                <Label className="text-sm font-medium mb-3 block">Medication need</Label>
                <RadioGroup value={medication} onValueChange={onSetMedication} className="grid grid-cols-2 gap-2">
                  {MEDICATION_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center">
                      <RadioGroupItem
                        value={option}
                        id={`med-${option}`}
                        className="min-h-[20px] min-w-[20px]"
                      />
                      <Label htmlFor={`med-${option}`} className="ml-2 text-sm cursor-pointer min-h-[44px] flex items-center">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
