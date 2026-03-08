export const MOOD_OPTIONS = ['Rough day', 'Okay day', 'Good day'] as const;
export type MoodOption = typeof MOOD_OPTIONS[number];

export const PHYSICAL_SYMPTOMS = [
  'Sharp pain', 'Aching', 'Migraine', 'Cramping', 'Menstrual cramps',
  'Nausea', 'Dizziness', 'Fatigue', 'Brain fog', 'Loss of appetite',
] as const;

export const MENTAL_EMOTIONAL_SYMPTOMS = [
  'Anxious', 'Depressed', 'Angry', 'Content', 'Happy', 'Sad',
  'Thankful', 'Frustrated', 'Optimistic', 'Calm', 'Stressed', 'Mind racing',
] as const;

export const BODY_AREAS = [
  'Head', 'Neck', 'Throat', 'Shoulders', 'Arms', 'Elbows',
  'Hands', 'Back', 'Buttocks', 'Legs', 'Knees', 'Feet',
] as const;

export const BODY_SIDES = ['Left', 'Right', 'Both'] as const;

export const FUNCTIONAL_IMPACTS = [
  'Socializing', 'Standing/walking', 'Reading', 'Watching screens',
  'Going outside', 'Household tasks', 'Personal care', 'Sleeping',
  'Managing speech',
] as const;

export const MEDICATION_OPTIONS = ['None', 'Half dose', 'Normal dose', 'Maximum dose'] as const;

export const POSITIVE_FACTORS = [
  'Vitamin injection', 'Steroid injection', 'Warm bath therapy', 'Physiotherapy',
  'Yoga', 'Mindfulness', 'Reduced stress',
  'Followed a plan', 'Rested proactively',
  'Positive social contact',
  'Maintained healthy/tailored plan',
  'Good sleep',
  'Exercise',
] as const;

export const POSITIVE_FACTOR_GROUPS: Record<string, string[]> = {
  'Treatment': ['Vitamin injection', 'Steroid injection', 'Warm bath therapy', 'Physiotherapy'],
  'Mental rest': ['Yoga', 'Mindfulness', 'Reduced stress'],
  'Energy pacing': ['Followed a plan', 'Rested proactively'],
  'Social': ['Positive social contact'],
  'Diet': ['Maintained healthy/tailored plan'],
  'Sleep': ['Good sleep'],
  'Exercise': ['Exercise'],
};

export const SLEEP_AIDS = ['Melatonin', 'Anti-anxiety', 'Sleeping pills'] as const;

export const EXERCISE_INTENSITIES = ['Light', 'Moderate', 'Vigorous'] as const;

export const SYMPTOM_CATEGORIES = ['Physical', 'Mental-emotional'] as const;
