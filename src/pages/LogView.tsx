import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import {
  MOOD_OPTIONS, PHYSICAL_SYMPTOMS, MENTAL_EMOTIONAL_SYMPTOMS,
  BODY_AREAS, BODY_SIDES, FUNCTIONAL_IMPACTS, MEDICATION_OPTIONS,
  POSITIVE_FACTOR_GROUPS, EXERCISE_INTENSITIES, SYMPTOM_CATEGORIES,
} from '@/lib/constants';
import type { MoodOption } from '@/lib/constants';
import type { LogEntry, BodyAreaEntry } from '@/lib/types';

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

export default function LogView() {
  const [date, setDate] = useState<Date>(new Date());
  const [mood, setMood] = useState<MoodOption | null>(null);
  const [severity, setSeverity] = useState([5]);
  const [showLayer2, setShowLayer2] = useState(false);
  const [showLayer3, setShowLayer3] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [bodyAreas, setBodyAreas] = useState<BodyAreaEntry[]>([]);
  const [medication, setMedication] = useState('None');
  const [functionalImpacts, setFunctionalImpacts] = useState<string[]>([]);
  const [positiveFactors, setPositiveFactors] = useState<string[]>([]);
  const [exerciseIntensity, setExerciseIntensity] = useState<string>('');
  const [entries, setEntries] = useLocalStorage<LogEntry[]>('ebbi-entries', []);
  const { toast } = useToast();

  const isGoodDay = mood === 'Good day';

  const toggleArrayItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const toggleBodyArea = (area: string, side: string) => {
    const exists = bodyAreas.find(b => b.area === area && b.side === side);
    if (exists) {
      setBodyAreas(bodyAreas.filter(b => !(b.area === area && b.side === side)));
    } else {
      // Remove other sides for same area, add new
      setBodyAreas([...bodyAreas.filter(b => b.area !== area), { area, side }]);
    }
  };

  const filteredSymptoms = () => {
    let result: readonly string[] = [];
    if (categories.includes('Physical')) result = [...result, ...PHYSICAL_SYMPTOMS];
    if (categories.includes('Mental-emotional')) result = [...result, ...MENTAL_EMOTIONAL_SYMPTOMS];
    if (categories.length === 0) result = [...PHYSICAL_SYMPTOMS, ...MENTAL_EMOTIONAL_SYMPTOMS];
    return result;
  };

  const handleSave = () => {
    if (!mood) {
      toast({ title: 'Please select how your day was', variant: 'destructive' });
      return;
    }
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      date: format(date, 'yyyy-MM-dd'),
      mood,
      ...(!isGoodDay && { severity: severity[0] }),
      ...(categories.length > 0 && { categories }),
      ...(symptoms.length > 0 && { symptoms }),
      ...(bodyAreas.length > 0 && { bodyAreas }),
      ...(medication !== 'None' && { medication }),
      ...(functionalImpacts.length > 0 && { functionalImpacts }),
      ...(positiveFactors.length > 0 && { positiveFactors }),
      ...(exerciseIntensity && { exerciseIntensity }),
    };
    setEntries(prev => [...prev, entry]);
    toast({ title: 'Entry saved ✓' });
    // Reset
    setMood(null);
    setSeverity([5]);
    setShowLayer2(false);
    setShowLayer3(false);
    setCategories([]);
    setSymptoms([]);
    setBodyAreas([]);
    setMedication('None');
    setFunctionalImpacts([]);
    setPositiveFactors([]);
    setExerciseIntensity('');
  };

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Log your day</h1>

      {/* Layer 1 */}
      <Card className="shadow-sm">
        <CardContent className="pt-6 space-y-6">
          {/* Date */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal min-h-[44px]',
                    !date && 'text-muted-foreground'
                  )}
                  aria-label="Select date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                  {format(date, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className={cn('p-3 pointer-events-auto')}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Mood */}
          <div>
            <Label className="text-sm font-medium mb-3 block">How was your day?</Label>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Day mood">
              {MOOD_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={mood === option}
                  onClick={() => setMood(option)}
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

          {/* Severity (hidden when Good day) */}
          {mood && !isGoodDay && (
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Severity: {severity[0]}/10
              </Label>
              <div className="px-1">
                <Slider
                  value={severity}
                  onValueChange={setSeverity}
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
          )}

          {/* Good day positive factors */}
          {isGoodDay && (
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
                        onClick={() => toggleArrayItem(positiveFactors, item, setPositiveFactors)}
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
                  {/* Exercise intensity sub-selector */}
                  {group === 'Exercise' && positiveFactors.includes('Exercise') && (
                    <div className="mt-3 ml-2">
                      <p className="text-xs text-muted-foreground mb-2">Intensity</p>
                      <div className="flex gap-2">
                        {EXERCISE_INTENSITIES.map((intensity) => (
                          <button
                            key={intensity}
                            type="button"
                            onClick={() => setExerciseIntensity(intensity)}
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
          )}

          {/* Save */}
          <Button
            onClick={handleSave}
            className="w-full min-h-[44px] bg-accent hover:bg-accent/80 text-foreground font-semibold"
            aria-label="Save log entry"
          >
            Save
          </Button>
        </CardContent>
      </Card>

      {/* Layer 2 - Add detail */}
      {mood && !isGoodDay && (
        <Card className="shadow-sm">
          <CardContent className="pt-4">
            <button
              type="button"
              onClick={() => setShowLayer2(!showLayer2)}
              className="flex w-full items-center justify-between min-h-[44px] text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-2"
              aria-expanded={showLayer2}
            >
              <span>Add detail</span>
              {showLayer2 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showLayer2 && (
              <div className="mt-4 space-y-6">
                {/* Category toggles */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Category</Label>
                  <div className="flex gap-2">
                    {SYMPTOM_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleArrayItem(categories, cat, setCategories)}
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

                {/* Symptom type selector */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Symptoms</Label>
                  <div className="flex flex-wrap gap-2">
                    {filteredSymptoms().map((symptom) => (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => toggleArrayItem(symptoms, symptom, setSymptoms)}
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

                {/* Body area selector */}
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
                              onClick={() => toggleBodyArea(area, side)}
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

                {/* Medication need */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Medication need</Label>
                  <RadioGroup value={medication} onValueChange={setMedication} className="grid grid-cols-2 gap-2">
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
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Layer 3 - Functional impacts */}
      {mood && !isGoodDay && (
        <Card className="shadow-sm">
          <CardContent className="pt-4">
            <button
              type="button"
              onClick={() => setShowLayer3(!showLayer3)}
              className="flex w-full items-center justify-between min-h-[44px] text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-2"
              aria-expanded={showLayer3}
            >
              <span>What needed extra effort today?</span>
              {showLayer3 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showLayer3 && (
              <div className="mt-4 space-y-3">
                {FUNCTIONAL_IMPACTS.map((impact) => (
                  <div key={impact} className="flex items-center min-h-[44px]">
                    <Checkbox
                      id={`impact-${impact}`}
                      checked={functionalImpacts.includes(impact)}
                      onCheckedChange={() => toggleArrayItem(functionalImpacts, impact, setFunctionalImpacts)}
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
      )}
    </div>
  );
}
