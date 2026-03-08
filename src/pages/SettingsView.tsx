import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { AppSettings } from '@/lib/types';
import { DEFAULT_SETTINGS } from '@/lib/types';

const fieldToggles: { key: keyof AppSettings; label: string }[] = [
  { key: 'showCategories', label: 'Symptom categories' },
  { key: 'showSymptoms', label: 'Symptom types' },
  { key: 'showBodyAreas', label: 'Body areas' },
  { key: 'showMedication', label: 'Medication need' },
  { key: 'showFunctionalImpacts', label: 'Functional impacts' },
  { key: 'showPositiveFactors', label: 'Positive factors' },
];

export default function SettingsView() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('ebbi-settings', DEFAULT_SETTINGS);

  const updateSetting = (key: keyof AppSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Logging fields */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Logging fields</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fieldToggles.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between min-h-[44px]">
              <Label htmlFor={key} className="text-sm cursor-pointer">{label}</Label>
              <Switch
                id={key}
                checked={settings[key]}
                onCheckedChange={(v) => updateSetting(key, v)}
                aria-label={`Toggle ${label}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Symptom profiles */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">My symptom profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Save and switch between symptom profiles for different conditions. Coming soon.
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* Notifications */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between min-h-[44px]">
            <Label htmlFor="notifications" className="text-sm cursor-pointer">Daily reminder</Label>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(v) => updateSetting('notifications', v)}
              aria-label="Toggle daily reminder"
            />
          </div>
        </CardContent>
      </Card>

      {/* Voice options */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Voice options</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Voice input for logging entries. Coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
