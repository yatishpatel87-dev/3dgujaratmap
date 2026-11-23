export type Language = 'gu' | 'en' | 'hi';

export type RegionId = 'north' | 'central' | 'south' | 'saurashtra' | 'kachchh';

export interface LocalizedText {
  gu: string;
  en: string;
  hi: string;
}

export interface DistrictRecord {
  id: string;
  number: number;
  nameGu: string;
  nameEn: string;
  nameHi: string;
  region: RegionId;
  headquarters: LocalizedText;
  geoLocation: LocalizedText;
  areaSqKm: string; // Verified number string or "માહિતી ઉપલબ્ધ નથી"
  rivers: LocalizedText;
  crops: LocalizedText;
  industries: LocalizedText;
  attractions: LocalizedText;
  history: LocalizedText;
  description: LocalizedText;
  geoJsonId: string;
  elevationHint: number;
  baseColor: string;
}

export type VfxPresetId =
  | 'none'
  | 'reveal'
  | 'explosion'
  | 'golden'
  | 'neon'
  | 'flyover'
  | 'borderDraw'
  | 'rotation'
  | 'spotlight'
  | 'regionReveal';

export type BackgroundPresetId =
  | 'black'
  | 'darkblue'
  | 'space'
  | 'golden'
  | 'grid'
  | 'satellite';

export type TextPosition = 'top' | 'center' | 'bottom' | 'hidden';

export type CameraViewPreset = 'perspective' | 'top' | 'front';

export type AmbientSoundscapeId = 'focus' | 'breeze' | 'tanpura' | 'rain';

export type AppMode = 'explore' | 'learn' | 'vfx' | 'quiz' | 'teacher' | 'export';

export type QuizMode =
  | 'identification'
  | 'findOnMap'
  | 'headquarters'
  | 'rivers'
  | 'attractions'
  | 'economy'
  | 'mapChallenge';

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  mode: QuizMode;
  difficulty: QuizDifficulty;
  districtId: string;
  question: LocalizedText;
  options: LocalizedText[]; // empty for direct map-click challenges
  correctIndex: number;
  explanation: LocalizedText;
  isMapClickChallenge?: boolean;
  isCustom?: boolean;
}

export interface QuizResultRecord {
  id: string;
  studentName: string;
  mode: QuizMode;
  difficulty: QuizDifficulty;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  score: number;
  stars: number;
  durationSec: number;
  timestamp: string;
}

export const REGION_LABELS: Record<RegionId, LocalizedText> = {
  north: {
    gu: 'ઉત્તર ગુજરાત',
    en: 'North Gujarat',
    hi: 'उत्तर गुजरात',
  },
  central: {
    gu: 'મધ્ય ગુજરાત',
    en: 'Central Gujarat',
    hi: 'मध्य गुजरात',
  },
  south: {
    gu: 'દક્ષિણ ગુજરાત',
    en: 'South Gujarat',
    hi: 'दक्षिण गुजरात',
  },
  saurashtra: {
    gu: 'સૌરાષ્ટ્ર',
    en: 'Saurashtra',
    hi: 'सौराष्ट्र',
  },
  kachchh: {
    gu: 'કચ્છ',
    en: 'Kachchh',
    hi: 'कच्छ',
  },
};

export const REGION_COLORS: Record<RegionId, string> = {
  north: '#38BDF8',
  central: '#34D399',
  south: '#A78BFA',
  saurashtra: '#F59E0B',
  kachchh: '#FB7185',
};

export const UNAVAILABLE_TEXT: LocalizedText = {
  gu: 'માહિતી ઉપલબ્ધ નથી',
  en: 'Information not available',
  hi: 'जानकारी उपलब्ध नहीं है',
};
