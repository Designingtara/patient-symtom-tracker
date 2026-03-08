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
import {
  MOOD_OPTIONS, PHYSICAL_SYMPTOMS, MENTAL_EMOTIONAL_SYMPTOMS,
  BODY_AREAS, BODY_SIDES, FUNCTIONAL_IMPACTS, MEDICATION_OPTIONS,
  POSITIVE_FACTOR_GROUPS, EXERCISE_INTENSITIES, SYMPTOM_CATEGORIES,
} from '@/lib/constants';
import type { MoodOption } from '@/lib/constants';
import type { LogEntry, BodyAreaEntry, SymptomProfile, AppSettings } from '@/lib/types';
import { DEFAULT_SETTINGS, moodToDayType } from '@/lib/types';

import MoodSelector from '@/components/log/MoodSelector';
import SeveritySlider from '@/components/log/SeveritySlider';
import GoodDayFactors from '@/components/log/GoodDayFactors';
import LayerDetail from '@/components/log/LayerDetail';
import LayerImpacts from '@/components/log/LayerImpacts';
import ProfileBar from '@/components/log/ProfileBar';
import ConfirmationToast from '@/components/log/ConfirmationToast';

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
  const [notes, setNotes] = useState('');
  const [entries, setEntries] = useLocalStorage<LogEntry[]>('ebbi-entries', []);
  const [settings] = useLocalStorage<AppSettings>('ebbi-settings', DEFAULT_SETTINGS);
  const [profiles] = useLocalStorage<SymptomProfile[]>('ebbi-profiles', []);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isGoodDay = mood === 'Good day';

  const toggleArrayItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const applyProfile = (profile: SymptomProfile) => {
    if (profile.categories.length > 0) setCategories(profile.categories);
    if (profile.symptoms.length > 0) setSymptoms(profile.symptoms);
    if (profile.bodyAreas.length > 0) setBodyAreas(profile.bodyAreas);
    if (profile.functionalImpacts.length > 0) setFunctionalImpacts(profile.functionalImpacts);
    // Auto-expand layers if profile has detail
    if (profile.symptoms.length > 0 || profile.bodyAreas.length > 0 || profile.categories.length > 0) {
      setShowLayer2(true);
    }
    if (profile.functionalImpacts.length > 0) {
      setShowLayer3(true);
    }
  };

  const handleSave = () => {
    if (!mood) return;

    const entry: LogEntry = {
      id: crypto.randomUUID(),
      date: format(date, 'yyyy-MM-dd'),
      timestamp: Date.now(),
      dayType: moodToDayType(mood),
      severity: isGoodDay ? null : severity[0],
    };

    // Only save fields that are visible via settings
    if (!isGoodDay) {
      if (settings.showCategories && categories.length > 0) entry.category = categories;
      if (settings.showSymptoms && symptoms.length > 0) entry.symptoms = symptoms;
      if (settings.showBodyAreas && bodyAreas.length > 0) entry.bodyAreas = bodyAreas;
      if (settings.showMedication && medication !== 'None') entry.medication = medication;
      if (settings.showFunctionalImpacts && functionalImpacts.length > 0) entry.functionalImpacts = functionalImpacts;
    }

    if (isGoodDay && settings.showPositiveFactors) {
      if (positiveFactors.length > 0) entry.positiveFactors = positiveFactors;
      if (exerciseIntensity) entry.exerciseIntensity = exerciseIntensity;
    }

    if (notes.trim()) entry.notes = notes.trim();

    setEntries(prev => [...prev, entry]);

    // Show confirmation
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);

    // Reset form, keep date
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
    setNotes('');
  };

  return (
    <div className="max-w-lg mx-auto space-y-4 relative">
      <h1 className="text-2xl font-bold">Log your day</h1>

      {/* Confirmation overlay */}
      <ConfirmationToast visible={showConfirmation} />

      {/* Symptom profiles bar */}
      {profiles.length > 0 && !isGoodDay && (
        <ProfileBar profiles={profiles} onApply={applyProfile} />
      )}

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
          <MoodSelector mood={mood} onSelect={setMood} />

          {/* Severity (hidden when Good day) */}
          {mood && !isGoodDay && (
            <SeveritySlider severity={severity} onChange={setSeverity} />
          )}

          {/* Good day positive factors */}
          {isGoodDay && settings.showPositiveFactors && (
            <GoodDayFactors
              positiveFactors={positiveFactors}
              exerciseIntensity={exerciseIntensity}
              onToggleFactor={(item) => toggleArrayItem(positiveFactors, item, setPositiveFactors)}
              onSetIntensity={setExerciseIntensity}
            />
          )}

          {/* Save */}
          <Button
            onClick={handleSave}
            disabled={!mood}
            className="w-full min-h-[44px] bg-accent hover:bg-accent/80 text-foreground font-semibold"
            aria-label="Save log entry"
          >
            Save
          </Button>
        </CardContent>
      </Card>

      {/* Layer 2 - Add detail */}
      {mood && !isGoodDay && (
        <LayerDetail
          show={showLayer2}
          onToggle={() => setShowLayer2(!showLayer2)}
          settings={settings}
          categories={categories}
          symptoms={symptoms}
          bodyAreas={bodyAreas}
          medication={medication}
          onToggleCategory={(cat) => toggleArrayItem(categories, cat, setCategories)}
          onToggleSymptom={(sym) => toggleArrayItem(symptoms, sym, setSymptoms)}
          onToggleBodyArea={(area, side) => {
            const exists = bodyAreas.find(b => b.area === area && b.side === side);
            if (exists) {
              setBodyAreas(bodyAreas.filter(b => !(b.area === area && b.side === side)));
            } else {
              setBodyAreas([...bodyAreas.filter(b => b.area !== area), { area, side }]);
            }
          }}
          onSetMedication={setMedication}
        />
      )}

      {/* Layer 3 - Functional impacts */}
      {mood && !isGoodDay && settings.showFunctionalImpacts && (
        <LayerImpacts
          show={showLayer3}
          onToggle={() => setShowLayer3(!showLayer3)}
          functionalImpacts={functionalImpacts}
          onToggleImpact={(impact) => toggleArrayItem(functionalImpacts, impact, setFunctionalImpacts)}
        />
      )}
    </div>
  );
}
