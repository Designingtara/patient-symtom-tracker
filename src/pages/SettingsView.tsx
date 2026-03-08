import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/use-local-storage';
import {
  PHYSICAL_SYMPTOMS, MENTAL_EMOTIONAL_SYMPTOMS,
  BODY_AREAS, BODY_SIDES, FUNCTIONAL_IMPACTS,
} from '@/lib/constants';
import type { AppSettings, SymptomProfile, BodyAreaEntry } from '@/lib/types';
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
  const [profiles, setProfiles] = useLocalStorage<SymptomProfile[]>('ebbi-profiles', []);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileSymptoms, setProfileSymptoms] = useState<string[]>([]);
  const [profileBodyAreas, setProfileBodyAreas] = useState<BodyAreaEntry[]>([]);
  const [profileImpacts, setProfileImpacts] = useState<string[]>([]);
  const [profileCategories, setProfileCategories] = useState<string[]>([]);

  const updateSetting = (key: keyof AppSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const toggleBodyArea = (area: string, side: string) => {
    const exists = profileBodyAreas.find(b => b.area === area && b.side === side);
    if (exists) {
      setProfileBodyAreas(profileBodyAreas.filter(b => !(b.area === area && b.side === side)));
    } else {
      setProfileBodyAreas([...profileBodyAreas.filter(b => b.area !== area), { area, side }]);
    }
  };

  const saveProfile = () => {
    if (!profileName.trim()) return;
    const profile: SymptomProfile = {
      id: crypto.randomUUID(),
      name: profileName.trim(),
      symptoms: profileSymptoms,
      bodyAreas: profileBodyAreas,
      functionalImpacts: profileImpacts,
      categories: profileCategories,
    };
    setProfiles(prev => [...prev, profile]);
    resetProfileForm();
  };

  const deleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
  };

  const resetProfileForm = () => {
    setShowProfileForm(false);
    setProfileName('');
    setProfileSymptoms([]);
    setProfileBodyAreas([]);
    setProfileImpacts([]);
    setProfileCategories([]);
  };

  const allSymptoms = [...PHYSICAL_SYMPTOMS, ...MENTAL_EMOTIONAL_SYMPTOMS];

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
        <CardContent className="space-y-4">
          {/* Existing profiles */}
          {profiles.length > 0 && (
            <div className="space-y-2">
              {profiles.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between min-h-[44px] bg-muted rounded-lg px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{profile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[
                        profile.symptoms.length > 0 && `${profile.symptoms.length} symptoms`,
                        profile.bodyAreas.length > 0 && `${profile.bodyAreas.length} body areas`,
                        profile.functionalImpacts.length > 0 && `${profile.functionalImpacts.length} impacts`,
                      ].filter(Boolean).join(', ') || 'Empty profile'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteProfile(profile.id)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground"
                    aria-label={`Delete ${profile.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Create profile */}
          {!showProfileForm ? (
            <Button
              variant="outline"
              onClick={() => setShowProfileForm(true)}
              className="w-full min-h-[44px]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create profile
            </Button>
          ) : (
            <div className="space-y-4 border rounded-lg p-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Profile name</Label>
                <Input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g. PEM day, Flare-up"
                  className="min-h-[44px]"
                />
              </div>

              {/* Symptoms */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Symptoms</Label>
                <div className="flex flex-wrap gap-2">
                  {allSymptoms.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleItem(profileSymptoms, sym, setProfileSymptoms)}
                      className={cn(
                        'min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-all',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        profileSymptoms.includes(sym)
                          ? 'bg-accent ring-2 ring-primary shadow-sm'
                          : 'bg-muted text-foreground hover:bg-accent/50'
                      )}
                      aria-pressed={profileSymptoms.includes(sym)}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body areas */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Body areas</Label>
                <div className="space-y-2">
                  {BODY_AREAS.map((area) => {
                    const selected = profileBodyAreas.find(b => b.area === area);
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

              {/* Functional impacts */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Functional impacts</Label>
                <div className="flex flex-wrap gap-2">
                  {FUNCTIONAL_IMPACTS.map((impact) => (
                    <button
                      key={impact}
                      type="button"
                      onClick={() => toggleItem(profileImpacts, impact, setProfileImpacts)}
                      className={cn(
                        'min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-all',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        profileImpacts.includes(impact)
                          ? 'bg-accent ring-2 ring-primary shadow-sm'
                          : 'bg-muted text-foreground hover:bg-accent/50'
                      )}
                      aria-pressed={profileImpacts.includes(impact)}
                    >
                      {impact}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={saveProfile}
                  disabled={!profileName.trim()}
                  className="flex-1 min-h-[44px] bg-accent hover:bg-accent/80 text-foreground font-semibold"
                >
                  Save profile
                </Button>
                <Button
                  variant="outline"
                  onClick={resetProfileForm}
                  className="min-h-[44px]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
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
