import type { MoodOption } from './constants';

export interface BodyAreaEntry {
  area: string;
  side: string;
}

export interface LogEntry {
  id: string;
  date: string;
  mood: MoodOption;
  severity?: number;
  categories?: string[];
  symptoms?: string[];
  bodyAreas?: BodyAreaEntry[];
  medication?: string;
  functionalImpacts?: string[];
  positiveFactors?: string[];
  sleepAids?: string[];
  exerciseIntensity?: string;
}

export interface AppSettings {
  showCategories: boolean;
  showSymptoms: boolean;
  showBodyAreas: boolean;
  showMedication: boolean;
  showFunctionalImpacts: boolean;
  showPositiveFactors: boolean;
  notifications: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  showCategories: true,
  showSymptoms: true,
  showBodyAreas: true,
  showMedication: true,
  showFunctionalImpacts: true,
  showPositiveFactors: true,
  notifications: false,
};
