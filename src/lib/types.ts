import type { MoodOption } from './constants';

export interface BodyAreaEntry {
  area: string;
  side: string;
}

export interface LogEntry {
  id: string;
  date: string;
  timestamp: number;
  dayType: 'rough' | 'okay' | 'good';
  severity: number | null;
  category?: string[];
  symptoms?: string[];
  bodyAreas?: BodyAreaEntry[];
  medication?: string;
  functionalImpacts?: string[];
  positiveFactors?: string[];
  exerciseIntensity?: string;
  notes?: string;
}

export interface SymptomProfile {
  id: string;
  name: string;
  symptoms: string[];
  bodyAreas: BodyAreaEntry[];
  functionalImpacts: string[];
  categories: string[];
}

export interface AppSettings {
  showCategories: boolean;
  showSymptoms: boolean;
  showBodyAreas: boolean;
  showMedication: boolean;
  showFunctionalImpacts: boolean;
  showPositiveFactors: boolean;
  notifications: boolean;
  voiceInput: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  showCategories: true,
  showSymptoms: true,
  showBodyAreas: true,
  showMedication: true,
  showFunctionalImpacts: true,
  showPositiveFactors: true,
  notifications: false,
  voiceInput: false,
};

/** Map MoodOption display text to stored dayType */
export function moodToDayType(mood: MoodOption): LogEntry['dayType'] {
  switch (mood) {
    case 'Rough day': return 'rough';
    case 'Okay day': return 'okay';
    case 'Good day': return 'good';
  }
}
