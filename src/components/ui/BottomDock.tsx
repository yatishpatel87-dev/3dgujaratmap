import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  EyeOff,
  ListOrdered,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Tag,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { speechController } from '../../utils/speechUtils';
import {
  BackgroundPresetId,
  CameraViewPreset,
  RegionId,
  VfxPresetId,
} from '../../types/gujarat';

const BG_QUICK_OPTIONS: { id: BackgroundPresetId; label: string }[] = [
  { id: 'darkblue', label: 'BG: Dark Blue' },
  { id: 'space', label: 'BG: Space Stars' },
  { id: 'golden', label: 'BG: Golden Glow' },
  { id: 'grid', label: 'BG: Digital Grid' },
  { id: 'satellite', label: 'BG: Satellite Sea' },
  { id: 'black', label: 'BG: Black Stage' },
];

const PRESET_LIST: { id: VfxPresetId; label: string }[] = [
  { id: 'none', label: 'Static' },
  { id: 'reveal', label: 'A. Reveal' },
  { id: 'explosion', label: 'B. Explosion' },
  { id: 'golden', label: 'C. Golden' },
  { id: 'neon', label: 'D. Neon' },
  { id: 'flyover', label: 'E. Flyover' },
  { id: 'borderDraw', label: 'F. Border Draw' },
  { id: 'rotation', label: 'G. 3D Rotate' },
  { id: 'spotlight', label: 'H. Spotlight' },
  { id: 'regionReveal', label: 'I. Regions' },
];

const REGION_FILTERS: { id: RegionId | 'all'; labelGu: string }[] = [
  { id: 'all', labelGu: 'બધા (૩૪)' },
  { id: 'north', labelGu: 'ઉત્તર' },
  { id: 'central', labelGu: 'મધ્ય' },
  { id: 'south', labelGu: 'દક્ષિણ' },
  { id: 'saurashtra', labelGu: 'સૌરાષ્ટ્ર' },
  { id: 'kachchh', labelGu: 'કચ્છ' },
];

export const BottomDock: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const appMode = useStudioStore((s) => s.appMode);
  const setAppMode = useStudioStore((s) => s.setAppMode);
  const cinemaMode = useStudioStore((s) => s.cinemaMode);
  const setCinemaMode = useStudioStore((s) => s.setCinemaMode);

  const activePreset = useStudioStore((s) => s.activePreset);
  const setActivePreset = useStudioStore((s) => s.setActivePreset);
  const isPlaying = useStudioStore((s) => s.isPlaying);
  const setIsPlaying = useStudioStore((s) => s.setIsPlaying);
  const stopAnimation = useStudioStore((s) => s.stopAnimation);
  const restartAnimation = useStudioStore((s) => s.restartAnimation);
  const timelineProgress = useStudioStore((s) => s.timelineProgress);
  const setTimelineProgress = useStudioStore((s) => s.setTimelineProgress);

  const cameraViewPreset = useStudioStore((s) => s.cameraViewPreset);
  const setCameraViewPreset = useStudioStore((s) => s.setCameraViewPreset);
  const showLabels = useStudioStore((s) => s.showLabels);
  const setShowLabels = useStudioStore((s) => s.setShowLabels);
  const regionFilter = useStudioStore((s) => s.regionFilter);
  const setRegionFilter = useStudioStore((s) => s.setRegionFilter);
  const backgroundPreset = useStudioStore((s) => s.backgroundPreset);
  const setBackgroundPreset = useStudioStore((s) => s.setBackgroundPreset);
  const ambientEnabled = useStudioStore((s) => s.ambientEnabled);
  const setAmbientEnabled = useStudioStore((s) => s.setAmbientEnabled);
  const sfxEnabled = useStudioStore((s) => s.sfxEnabled);
  const setSfxEnabled = useStudioStore((s) => s.setSfxEnabled);
  const autoTourDistricts = useStudioStore((s) => s.autoTourDistricts);
  const setAutoTourDistricts = useStudioStore((s) => s.setAutoTourDistricts);

  if (cinemaMode || appMode === 'quiz') return null;

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Ignore if iframe restricts fullscreen
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center w-[min(960px,95vw)] pointer-events-none">
      {/* Mobile / tablet quick mode switcher */}
      <div className="lg:hidden pointer-events-auto mb-2 flex items-center gap-1.5 overflow-x-auto max-w-full px-2 py-1 rounded-lg bg-[#080e1d]/95 border border-cyan-500/20">
        {(['explore', 'vfx', 'quiz', 'teacher', 'export'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setAppMode(m)}
            className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap cursor-pointer ${
              appMode === m ? 'bg-cyan-500 text-slate-950' : 'text-slate-300'
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Collapse / Expand toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-t-md bg-[#080e1d]/95 border border-b-0 border-cyan-500/25 text-xs font-medium text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
      >
        {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        <span>{collapsed ? 'Show VFX Controls' : 'Hide VFX Controls'}</span>
      </button>

      {!collapsed && (
        <div className="pointer-events-auto w-full rounded-xl bg-[#080e1d]/95 border border-cyan-500/25 p-3 shadow-2xl flex flex-col gap-2.5">
          {/* Row 1: 9 VFX Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {PRESET_LIST.map((p) => {
              const active = activePreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePreset(p.id, p.id !== 'none')}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-cyan-500 text-slate-950 font-semibold'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Row 2: Playback, Timeline, Camera Views, Region Filter, Utilities */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
            {/* Playback controls + timeline */}
            <div className="flex items-center gap-2 min-w-[230px] flex-1">
              <button
                type="button"
                onClick={() => {
                  if (activePreset === 'none') {
                    setActivePreset('reveal', true);
                  } else {
                    setIsPlaying(!isPlaying);
                  }
                }}
                title={isPlaying ? 'Pause' : 'Play'}
                className="p-1.5 rounded-md bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/30 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={stopAnimation}
                title="Stop"
                className="p-1.5 rounded-md bg-slate-800/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={restartAnimation}
                title="Restart"
                className="p-1.5 rounded-md bg-slate-800/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(timelineProgress * 100)}
                onChange={(e) => setTimelineProgress(Number(e.target.value) / 100)}
                aria-label="Animation timeline"
                className="studio-slider flex-1 min-w-[80px]"
              />
              <span className="font-mono-tabular text-xs text-slate-400 w-9 text-right">
                {Math.round(timelineProgress * 100)}%
              </span>
            </div>

            {/* Region Filter */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
              {REGION_FILTERS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRegionFilter(r.id)}
                  className={`px-2 py-1 rounded text-xs whitespace-nowrap transition-colors cursor-pointer ${
                    regionFilter === r.id
                      ? 'bg-amber-400/90 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {r.labelGu}
                </button>
              ))}
            </div>

            {/* Camera Views, Background Effect, Sound & Cinema/Fullscreen */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(['perspective', 'top', 'front'] as CameraViewPreset[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setCameraViewPreset(v)}
                  className={`px-2 py-1 rounded text-xs capitalize transition-colors cursor-pointer ${
                    cameraViewPreset === v
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {v}
                </button>
              ))}

              <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                <select
                  value={backgroundPreset}
                  onChange={(e) => setBackgroundPreset(e.target.value as BackgroundPresetId)}
                  aria-label="Background Effect"
                  className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                >
                  {BG_QUICK_OPTIONS.map((bg) => (
                    <option key={bg.id} value={bg.id} className="bg-slate-900 text-slate-100">
                      {bg.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowLabels(!showLabels)}
                title="Toggle Gujarati Labels"
                className={`p-1.5 rounded border transition-colors cursor-pointer ${
                  showLabels
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setAmbientEnabled(!ambientEnabled)}
                title={
                  ambientEnabled
                    ? 'Mute Background Soundscape'
                    : 'Play Classroom Background Sound'
                }
                aria-label="Toggle Background Sound"
                className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  ambientEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                {ambientEnabled ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
                <span>BG Sound</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (autoTourDistricts) {
                    setAutoTourDistricts(false);
                    speechController.stop();
                  } else {
                    setAppMode('learn');
                    setAutoTourDistricts(true);
                  }
                }}
                title="Read all 34 districts sequentially one by one"
                className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  autoTourDistricts
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-semibold'
                    : 'bg-slate-900 text-amber-300 border-slate-800 hover:border-amber-400/40'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>{autoTourDistricts ? 'Stop 1→34' : '1→34 વાંચો'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSfxEnabled(!sfxEnabled)}
                title={sfxEnabled ? 'Mute Click/VFX Sound Effects' : 'Enable Sound Effects'}
                className={`px-2 py-1 rounded border text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  sfxEnabled
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                SFX {sfxEnabled ? 'On' : 'Off'}
              </button>

              <button
                type="button"
                onClick={() => setCinemaMode(true)}
                title="Hide UI (Classroom Projection)"
                className="p-1.5 rounded bg-slate-900 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                title="Fullscreen"
                className="p-1.5 rounded bg-slate-900 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
