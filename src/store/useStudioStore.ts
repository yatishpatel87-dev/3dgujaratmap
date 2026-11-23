import { create } from 'zustand';
import {
  AmbientSoundscapeId,
  AppMode,
  BackgroundPresetId,
  CameraViewPreset,
  Language,
  QuizDifficulty,
  QuizQuestion,
  QuizResultRecord,
  RegionId,
  TextPosition,
  VfxPresetId,
} from '../types/gujarat';
import { ambientAudioManager } from '../utils/ambientAudio';
import { soundEffects } from '../utils/soundEffects';

const DEMO_STORAGE_KEY = 'gujarat_vfx_demo_v1';

interface DemoPersistedData {
  studiedDistrictIds: string[];
  quizHistory: QuizResultRecord[];
  customQuestions: QuizQuestion[];
  quizDifficulty: QuizDifficulty;
  totalCorrect: number;
  totalIncorrect: number;
}

const DEFAULT_DEMO_DATA: DemoPersistedData = {
  studiedDistrictIds: ['ahmedabad', 'kachchh', 'gandhinagar', 'surat', 'vav-tharad'],
  quizHistory: [
    {
      id: 'demo-run-1',
      studentName: 'આરવ પટેલ (Demo)',
      mode: 'identification',
      difficulty: 'medium',
      totalQuestions: 10,
      correctCount: 8,
      incorrectCount: 2,
      score: 80,
      stars: 4,
      durationSec: 112,
      timestamp: '2026-11-15T10:30:00.000Z',
    },
  ],
  customQuestions: [],
  quizDifficulty: 'medium',
  totalCorrect: 8,
  totalIncorrect: 2,
};

function loadDemoData(): DemoPersistedData {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return DEFAULT_DEMO_DATA;
    const parsed = JSON.parse(raw) as Partial<DemoPersistedData>;
    return {
      studiedDistrictIds: Array.isArray(parsed.studiedDistrictIds)
        ? parsed.studiedDistrictIds
        : DEFAULT_DEMO_DATA.studiedDistrictIds,
      quizHistory: Array.isArray(parsed.quizHistory)
        ? parsed.quizHistory
        : DEFAULT_DEMO_DATA.quizHistory,
      customQuestions: Array.isArray(parsed.customQuestions) ? parsed.customQuestions : [],
      quizDifficulty: parsed.quizDifficulty ?? 'medium',
      totalCorrect: typeof parsed.totalCorrect === 'number' ? parsed.totalCorrect : 8,
      totalIncorrect: typeof parsed.totalIncorrect === 'number' ? parsed.totalIncorrect : 2,
    };
  } catch {
    return DEFAULT_DEMO_DATA;
  }
}

function saveDemoData(data: DemoPersistedData): void {
  try {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota issues in private browsing
  }
}

interface StudioState {
  // Navigation & Modes
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  cinemaMode: boolean;
  setCinemaMode: (v: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;

  // Map Selection & Filtering
  selectedDistrictId: string | null;
  hoveredDistrictId: string | null;
  regionFilter: RegionId | 'all';
  setSelectedDistrictId: (id: string | null, markStudied?: boolean) => void;
  setHoveredDistrictId: (id: string | null) => void;
  setRegionFilter: (region: RegionId | 'all') => void;

  // Quiz Map Challenge Callback
  quizTargetDistrictId: string | null;
  quizHighlightDistrictId: string | null;
  onMapClickInQuiz: ((districtId: string) => void) | null;
  setQuizMapHooks: (hooks: {
    targetId: string | null;
    highlightId: string | null;
    onClick: ((districtId: string) => void) | null;
  }) => void;

  // VFX Animation Engine Controls
  activePreset: VfxPresetId;
  isPlaying: boolean;
  timelineProgress: number; // 0..1
  durationSec: number; // 4..30
  speed: number; // 0.25..3
  borderGlowIntensity: number; // 0..3
  lightIntensity: number; // 0.3..2.5
  particleDensity: number; // 0..100
  backgroundPreset: BackgroundPresetId;
  textPosition: TextPosition;
  customTitleGu: string;
  showLabels: boolean;
  cameraZoom: number; // 0.5..2.0
  cameraRotationDeg: number; // -180..180
  cameraViewPreset: CameraViewPreset;
  cameraTriggerNonce: number;

  // Active animation readouts (updated by TimelineDriver)
  activeRevealDistrictId: string | null;
  activeRegionReveal: RegionId | null;

  setActivePreset: (preset: VfxPresetId, autoPlay?: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setTimelineProgress: (progress: number) => void;
  stopAnimation: () => void;
  restartAnimation: () => void;
  setDurationSec: (sec: number) => void;
  setSpeed: (speed: number) => void;
  setBorderGlowIntensity: (val: number) => void;
  setLightIntensity: (val: number) => void;
  setParticleDensity: (val: number) => void;
  setBackgroundPreset: (bg: BackgroundPresetId) => void;
  setTextPosition: (pos: TextPosition) => void;
  setCustomTitleGu: (title: string) => void;
  setShowLabels: (show: boolean) => void;
  setCameraZoom: (zoom: number) => void;
  setCameraRotationDeg: (deg: number) => void;
  setCameraViewPreset: (view: CameraViewPreset) => void;
  setActiveRevealState: (districtId: string | null, region: RegionId | null) => void;

  // Canvas & Export Registry
  canvasElement: HTMLCanvasElement | null;
  setCanvasElement: (el: HTMLCanvasElement | null) => void;
  isRecording: boolean;
  setIsRecording: (rec: boolean) => void;

  // Classroom Ambient Audio, Sound Effects & Sequential Narration Tour
  ambientEnabled: boolean;
  ambientSoundscape: AmbientSoundscapeId;
  ambientVolume: number; // 0..1
  sfxEnabled: boolean;
  autoTourDistricts: boolean;
  autoReadOnSelect: boolean;
  setAmbientEnabled: (enabled: boolean) => void;
  setAmbientSoundscape: (soundscape: AmbientSoundscapeId) => void;
  setAmbientVolume: (volume: number) => void;
  setSfxEnabled: (enabled: boolean) => void;
  setAutoTourDistricts: (enabled: boolean) => void;
  setAutoReadOnSelect: (enabled: boolean) => void;

  // Teacher & Student Demo Progress (localStorage)
  studiedDistrictIds: string[];
  quizHistory: QuizResultRecord[];
  customQuestions: QuizQuestion[];
  quizDifficulty: QuizDifficulty;
  totalCorrect: number;
  totalIncorrect: number;

  markDistrictStudied: (id: string) => void;
  recordQuizResult: (result: QuizResultRecord) => void;
  setQuizDifficulty: (diff: QuizDifficulty) => void;
  addCustomQuestion: (q: QuizQuestion) => void;
  deleteCustomQuestion: (id: string) => void;
  resetDemoProgress: () => void;
}

const initialDemo = loadDemoData();

export const useStudioStore = create<StudioState>((set, get) => ({
  appMode: 'explore',
  setAppMode: (mode) =>
    set({
      appMode: mode,
      cinemaMode: false,
    }),
  cinemaMode: false,
  setCinemaMode: (cinemaMode) => set({ cinemaMode }),
  language: 'gu',
  setLanguage: (language) => set({ language }),

  selectedDistrictId: 'ahmedabad',
  hoveredDistrictId: null,
  regionFilter: 'all',
  setSelectedDistrictId: (id, markStudied = true) => {
    set({ selectedDistrictId: id });
    if (id && markStudied) {
      get().markDistrictStudied(id);
    }
  },
  setHoveredDistrictId: (hoveredDistrictId) => set({ hoveredDistrictId }),
  setRegionFilter: (regionFilter) => set({ regionFilter }),

  quizTargetDistrictId: null,
  quizHighlightDistrictId: null,
  onMapClickInQuiz: null,
  setQuizMapHooks: ({ targetId, highlightId, onClick }) =>
    set({
      quizTargetDistrictId: targetId,
      quizHighlightDistrictId: highlightId,
      onMapClickInQuiz: onClick,
    }),

  activePreset: 'none',
  isPlaying: false,
  timelineProgress: 0,
  durationSec: 12,
  speed: 1,
  borderGlowIntensity: 1.4,
  lightIntensity: 1.2,
  particleDensity: 55,
  backgroundPreset: 'darkblue',
  textPosition: 'top',
  customTitleGu: 'ગુજરાત — ૩૪ જિલ્લાઓનો 3D ભૌગોલિક નકશો',
  showLabels: true,
  cameraZoom: 1,
  cameraRotationDeg: 0,
  cameraViewPreset: 'perspective',
  cameraTriggerNonce: 0,

  activeRevealDistrictId: null,
  activeRegionReveal: null,

  setActivePreset: (preset, autoPlay = true) => {
    soundEffects.playVfxTrigger();
    set((state) => ({
      activePreset: preset,
      isPlaying: preset === 'none' ? false : autoPlay,
      timelineProgress: 0,
      activeRevealDistrictId: null,
      activeRegionReveal: null,
      backgroundPreset:
        preset === 'reveal'
          ? 'black'
          : preset === 'neon'
          ? 'grid'
          : preset === 'golden'
          ? 'golden'
          : state.backgroundPreset,
    }));
  },
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setTimelineProgress: (timelineProgress) =>
    set({ timelineProgress: Math.max(0, Math.min(1, timelineProgress)) }),
  stopAnimation: () =>
    set({
      isPlaying: false,
      timelineProgress: 0,
      activeRevealDistrictId: null,
      activeRegionReveal: null,
    }),
  restartAnimation: () =>
    set({
      timelineProgress: 0,
      isPlaying: true,
      activeRevealDistrictId: null,
      activeRegionReveal: null,
    }),
  setDurationSec: (durationSec) => set({ durationSec }),
  setSpeed: (speed) => set({ speed }),
  setBorderGlowIntensity: (borderGlowIntensity) => set({ borderGlowIntensity }),
  setLightIntensity: (lightIntensity) => set({ lightIntensity }),
  setParticleDensity: (particleDensity) => set({ particleDensity }),
  setBackgroundPreset: (backgroundPreset) => {
    soundEffects.playVfxTrigger();
    set({ backgroundPreset });
  },
  setTextPosition: (textPosition) => set({ textPosition }),
  setCustomTitleGu: (customTitleGu) => set({ customTitleGu }),
  setShowLabels: (showLabels) => set({ showLabels }),
  setCameraZoom: (cameraZoom) => set({ cameraZoom }),
  setCameraRotationDeg: (cameraRotationDeg) => set({ cameraRotationDeg }),
  setCameraViewPreset: (cameraViewPreset) =>
    set((s) => ({
      cameraViewPreset,
      cameraTriggerNonce: s.cameraTriggerNonce + 1,
    })),
  setActiveRevealState: (activeRevealDistrictId, activeRegionReveal) =>
    set({ activeRevealDistrictId, activeRegionReveal }),

  canvasElement: null,
  setCanvasElement: (canvasElement) => set({ canvasElement }),
  isRecording: false,
  setIsRecording: (isRecording) => set({ isRecording }),

  ambientEnabled: false,
  ambientSoundscape: 'focus',
  ambientVolume: 0.4,
  sfxEnabled: true,
  autoTourDistricts: false,
  autoReadOnSelect: false,
  setAmbientEnabled: (ambientEnabled) => {
    const s = get();
    set({ ambientEnabled });
    ambientAudioManager.syncState(ambientEnabled, s.ambientSoundscape, s.ambientVolume);
  },
  setAmbientSoundscape: (ambientSoundscape) => {
    const s = get();
    set({ ambientSoundscape });
    ambientAudioManager.syncState(s.ambientEnabled, ambientSoundscape, s.ambientVolume);
  },
  setAmbientVolume: (ambientVolume) => {
    const clamped = Math.max(0.05, Math.min(1, ambientVolume));
    const s = get();
    set({ ambientVolume: clamped });
    ambientAudioManager.syncState(s.ambientEnabled, s.ambientSoundscape, clamped);
  },
  setSfxEnabled: (sfxEnabled) => {
    soundEffects.setEnabled(sfxEnabled);
    set({ sfxEnabled });
    if (sfxEnabled) {
      soundEffects.playDistrictSelect();
    }
  },
  setAutoTourDistricts: (autoTourDistricts) => set({ autoTourDistricts }),
  setAutoReadOnSelect: (autoReadOnSelect) => set({ autoReadOnSelect }),

  studiedDistrictIds: initialDemo.studiedDistrictIds,
  quizHistory: initialDemo.quizHistory,
  customQuestions: initialDemo.customQuestions,
  quizDifficulty: initialDemo.quizDifficulty,
  totalCorrect: initialDemo.totalCorrect,
  totalIncorrect: initialDemo.totalIncorrect,

  markDistrictStudied: (id) => {
    const state = get();
    if (state.studiedDistrictIds.includes(id)) return;
    const nextStudied = [...state.studiedDistrictIds, id];
    set({ studiedDistrictIds: nextStudied });
    saveDemoData({
      studiedDistrictIds: nextStudied,
      quizHistory: state.quizHistory,
      customQuestions: state.customQuestions,
      quizDifficulty: state.quizDifficulty,
      totalCorrect: state.totalCorrect,
      totalIncorrect: state.totalIncorrect,
    });
  },

  recordQuizResult: (result) => {
    const state = get();
    const nextHistory = [result, ...state.quizHistory].slice(0, 25);
    const nextCorrect = state.totalCorrect + result.correctCount;
    const nextIncorrect = state.totalIncorrect + result.incorrectCount;
    set({
      quizHistory: nextHistory,
      totalCorrect: nextCorrect,
      totalIncorrect: nextIncorrect,
    });
    saveDemoData({
      studiedDistrictIds: state.studiedDistrictIds,
      quizHistory: nextHistory,
      customQuestions: state.customQuestions,
      quizDifficulty: state.quizDifficulty,
      totalCorrect: nextCorrect,
      totalIncorrect: nextIncorrect,
    });
  },

  setQuizDifficulty: (quizDifficulty) => {
    const state = get();
    set({ quizDifficulty });
    saveDemoData({
      studiedDistrictIds: state.studiedDistrictIds,
      quizHistory: state.quizHistory,
      customQuestions: state.customQuestions,
      quizDifficulty,
      totalCorrect: state.totalCorrect,
      totalIncorrect: state.totalIncorrect,
    });
  },

  addCustomQuestion: (q) => {
    const state = get();
    const nextCustom = [q, ...state.customQuestions];
    set({ customQuestions: nextCustom });
    saveDemoData({
      studiedDistrictIds: state.studiedDistrictIds,
      quizHistory: state.quizHistory,
      customQuestions: nextCustom,
      quizDifficulty: state.quizDifficulty,
      totalCorrect: state.totalCorrect,
      totalIncorrect: state.totalIncorrect,
    });
  },

  deleteCustomQuestion: (id) => {
    const state = get();
    const nextCustom = state.customQuestions.filter((q) => q.id !== id);
    set({ customQuestions: nextCustom });
    saveDemoData({
      studiedDistrictIds: state.studiedDistrictIds,
      quizHistory: state.quizHistory,
      customQuestions: nextCustom,
      quizDifficulty: state.quizDifficulty,
      totalCorrect: state.totalCorrect,
      totalIncorrect: state.totalIncorrect,
    });
  },

  resetDemoProgress: () => {
    const resetState: DemoPersistedData = {
      studiedDistrictIds: [],
      quizHistory: [],
      customQuestions: [],
      quizDifficulty: 'medium',
      totalCorrect: 0,
      totalIncorrect: 0,
    };
    set(resetState);
    saveDemoData(resetState);
  },
}));
