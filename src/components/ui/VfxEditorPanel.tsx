import React from 'react';
import { Pause, Play, RotateCcw, Sliders, Square, Volume2, VolumeX, X } from 'lucide-react';
import { DISTRICTS_DB } from '../../data/districtsDatabase';
import { useStudioStore } from '../../store/useStudioStore';
import {
  AmbientSoundscapeId,
  BackgroundPresetId,
  CameraViewPreset,
  TextPosition,
  VfxPresetId,
} from '../../types/gujarat';
import { AMBIENT_SOUNDSCAPES } from '../../utils/ambientAudio';

const BACKGROUNDS: { id: BackgroundPresetId; label: string }[] = [
  { id: 'black', label: '1. Black Cinematic' },
  { id: 'darkblue', label: '2. Dark Blue Digital' },
  { id: 'space', label: '3. Space Particles' },
  { id: 'golden', label: '4. Golden Atmosphere' },
  { id: 'grid', label: '5. Digital Grid' },
  { id: 'satellite', label: '6. Satellite Terrain' },
];

const VFX_PRESETS: { id: VfxPresetId; label: string }[] = [
  { id: 'none', label: 'Static View' },
  { id: 'reveal', label: 'A. District Reveal' },
  { id: 'explosion', label: 'B. District Explosion' },
  { id: 'golden', label: 'C. Golden Highlight' },
  { id: 'neon', label: 'D. Neon Effect' },
  { id: 'flyover', label: 'E. District Flyover' },
  { id: 'borderDraw', label: 'F. Border Draw' },
  { id: 'rotation', label: 'G. 3D Rotation' },
  { id: 'spotlight', label: 'H. District Spotlight' },
  { id: 'regionReveal', label: 'I. Region-wise Reveal' },
];

export const VfxEditorPanel: React.FC = () => {
  const appMode = useStudioStore((s) => s.appMode);
  const setAppMode = useStudioStore((s) => s.setAppMode);
  const cinemaMode = useStudioStore((s) => s.cinemaMode);

  const activePreset = useStudioStore((s) => s.activePreset);
  const setActivePreset = useStudioStore((s) => s.setActivePreset);
  const isPlaying = useStudioStore((s) => s.isPlaying);
  const setIsPlaying = useStudioStore((s) => s.setIsPlaying);
  const stopAnimation = useStudioStore((s) => s.stopAnimation);
  const restartAnimation = useStudioStore((s) => s.restartAnimation);

  const timelineProgress = useStudioStore((s) => s.timelineProgress);
  const setTimelineProgress = useStudioStore((s) => s.setTimelineProgress);
  const durationSec = useStudioStore((s) => s.durationSec);
  const setDurationSec = useStudioStore((s) => s.setDurationSec);
  const speed = useStudioStore((s) => s.speed);
  const setSpeed = useStudioStore((s) => s.setSpeed);

  const cameraZoom = useStudioStore((s) => s.cameraZoom);
  const setCameraZoom = useStudioStore((s) => s.setCameraZoom);
  const cameraRotationDeg = useStudioStore((s) => s.cameraRotationDeg);
  const setCameraRotationDeg = useStudioStore((s) => s.setCameraRotationDeg);
  const cameraViewPreset = useStudioStore((s) => s.cameraViewPreset);
  const setCameraViewPreset = useStudioStore((s) => s.setCameraViewPreset);

  const selectedDistrictId = useStudioStore((s) => s.selectedDistrictId);
  const setSelectedDistrictId = useStudioStore((s) => s.setSelectedDistrictId);

  const borderGlowIntensity = useStudioStore((s) => s.borderGlowIntensity);
  const setBorderGlowIntensity = useStudioStore((s) => s.setBorderGlowIntensity);
  const lightIntensity = useStudioStore((s) => s.lightIntensity);
  const setLightIntensity = useStudioStore((s) => s.setLightIntensity);
  const particleDensity = useStudioStore((s) => s.particleDensity);
  const setParticleDensity = useStudioStore((s) => s.setParticleDensity);
  const backgroundPreset = useStudioStore((s) => s.backgroundPreset);
  const setBackgroundPreset = useStudioStore((s) => s.setBackgroundPreset);
  const textPosition = useStudioStore((s) => s.textPosition);
  const setTextPosition = useStudioStore((s) => s.setTextPosition);
  const customTitleGu = useStudioStore((s) => s.customTitleGu);
  const setCustomTitleGu = useStudioStore((s) => s.setCustomTitleGu);
  const ambientEnabled = useStudioStore((s) => s.ambientEnabled);
  const setAmbientEnabled = useStudioStore((s) => s.setAmbientEnabled);
  const ambientSoundscape = useStudioStore((s) => s.ambientSoundscape);
  const setAmbientSoundscape = useStudioStore((s) => s.setAmbientSoundscape);
  const ambientVolume = useStudioStore((s) => s.ambientVolume);
  const setAmbientVolume = useStudioStore((s) => s.setAmbientVolume);
  const sfxEnabled = useStudioStore((s) => s.sfxEnabled);
  const setSfxEnabled = useStudioStore((s) => s.setSfxEnabled);

  if (appMode !== 'vfx' || cinemaMode) return null;

  return (
    <aside className="absolute top-4 right-4 bottom-24 w-[min(390px,92vw)] z-20 rounded-xl bg-[#080e1d]/95 border border-cyan-500/25 shadow-2xl flex flex-col overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-800/90 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="font-display text-base font-semibold text-white">
            Professional VFX Editor
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setAppMode('explore')}
          aria-label="Close VFX Editor"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-xs">
        {/* Transport & Timeline */}
        <section className="space-y-3">
          <div className="text-slate-300 font-semibold">Animation Transport</div>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => {
                if (activePreset === 'none') setActivePreset('reveal', true);
                else setIsPlaying(true);
              }}
              className="flex items-center justify-center gap-1 py-2 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Play</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(false)}
              className="flex items-center justify-center gap-1 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
            <button
              type="button"
              onClick={stopAnimation}
              className="flex items-center justify-center gap-1 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              <Square className="w-3 h-3" />
              <span>Stop</span>
            </button>
            <button
              type="button"
              onClick={restartAnimation}
              className="flex items-center justify-center gap-1 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          </div>

          <label className="block space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Preset</span>
            </div>
            <select
              value={activePreset}
              onChange={(e) => setActivePreset(e.target.value as VfxPresetId, true)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
            >
              {VFX_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Animation Timeline</span>
              <span className="font-mono-tabular text-cyan-300">
                {Math.round(timelineProgress * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(timelineProgress * 100)}
              onChange={(e) => setTimelineProgress(Number(e.target.value) / 100)}
              className="studio-slider w-full"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Duration</span>
                <span className="font-mono-tabular text-cyan-300">{durationSec}s</span>
              </div>
              <input
                type="range"
                min={4}
                max={30}
                step={1}
                value={durationSec}
                onChange={(e) => setDurationSec(Number(e.target.value))}
                className="studio-slider w-full"
              />
            </label>

            <label className="block space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Speed</span>
                <span className="font-mono-tabular text-cyan-300">{speed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min={0.25}
                max={3}
                step={0.25}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="studio-slider w-full"
              />
            </label>
          </div>
        </section>

        {/* Camera & District Focus */}
        <section className="space-y-3 pt-3 border-t border-slate-800/80">
          <div className="text-slate-300 font-semibold">Camera & Target District</div>

          <label className="block space-y-1">
            <span className="text-slate-300">Target District (34 Districts)</span>
            <select
              value={selectedDistrictId ?? ''}
              onChange={(e) => setSelectedDistrictId(e.target.value || null, false)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
            >
              {DISTRICTS_DB.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.number}. {d.nameGu} — {d.nameEn}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-3 gap-1.5">
            {(['perspective', 'top', 'front'] as CameraViewPreset[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setCameraViewPreset(v)}
                className={`py-1.5 rounded-md capitalize font-medium border cursor-pointer ${
                  cameraViewPreset === v
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                {v} View
              </button>
            ))}
          </div>

          <label className="block space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Camera Zoom</span>
              <span className="font-mono-tabular text-cyan-300">{cameraZoom.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.6}
              max={2.0}
              step={0.05}
              value={cameraZoom}
              onChange={(e) => setCameraZoom(Number(e.target.value))}
              className="studio-slider w-full"
            />
          </label>

          <label className="block space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Camera / Map Rotation</span>
              <span className="font-mono-tabular text-cyan-300">{cameraRotationDeg}°</span>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              step={5}
              value={cameraRotationDeg}
              onChange={(e) => setCameraRotationDeg(Number(e.target.value))}
              className="studio-slider w-full"
            />
          </label>
        </section>

        {/* Lighting, Glow & Particles */}
        <section className="space-y-3 pt-3 border-t border-slate-800/80">
          <div className="text-slate-300 font-semibold">Lighting, Glow & Particles</div>

          <label className="block space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Border Glow Intensity</span>
              <span className="font-mono-tabular text-cyan-300">
                {borderGlowIntensity.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min={0.2}
              max={3.0}
              step={0.1}
              value={borderGlowIntensity}
              onChange={(e) => setBorderGlowIntensity(Number(e.target.value))}
              className="studio-slider w-full"
            />
          </label>

          <label className="block space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Light Intensity</span>
              <span className="font-mono-tabular text-cyan-300">{lightIntensity.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={0.3}
              max={2.5}
              step={0.1}
              value={lightIntensity}
              onChange={(e) => setLightIntensity(Number(e.target.value))}
              className="studio-slider w-full"
            />
          </label>

          <label className="block space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Particle Density</span>
              <span className="font-mono-tabular text-cyan-300">{particleDensity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={particleDensity}
              onChange={(e) => setParticleDensity(Number(e.target.value))}
              className="studio-slider w-full"
            />
          </label>
        </section>

        {/* Cinematic Background & Gujarati Title */}
        <section className="space-y-3 pt-3 border-t border-slate-800/80">
          <div className="text-slate-300 font-semibold">Background & Gujarati Title</div>

          <label className="block space-y-1">
            <span className="text-slate-300">Cinematic Background</span>
            <select
              value={backgroundPreset}
              onChange={(e) => setBackgroundPreset(e.target.value as BackgroundPresetId)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
            >
              {BACKGROUNDS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-slate-300">Gujarati Title Editor</span>
            <input
              type="text"
              value={customTitleGu}
              onChange={(e) => setCustomTitleGu(e.target.value)}
              placeholder="ગુજરાતનો 3D નકશો..."
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </label>

          <div className="space-y-1">
            <span className="text-slate-300">Text Position</span>
            <div className="grid grid-cols-4 gap-1.5">
              {(['top', 'center', 'bottom', 'hidden'] as TextPosition[]).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setTextPosition(pos)}
                  className={`py-1.5 rounded-md capitalize font-medium border cursor-pointer ${
                    textPosition === pos
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Classroom Ambient Audio */}
        <section className="space-y-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="text-slate-300 font-semibold flex items-center gap-1.5">
              {ambientEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>Classroom Ambient Audio</span>
            </div>
            <button
              type="button"
              onClick={() => setAmbientEnabled(!ambientEnabled)}
              className={`px-3 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                ambientEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              {ambientEnabled ? 'On' : 'Off'}
            </button>
          </div>

          <label className="block space-y-1">
            <span className="text-slate-300">Soundscape · ધ્વનિ વાતાવરણ</span>
            <select
              value={ambientSoundscape}
              onChange={(e) => setAmbientSoundscape(e.target.value as AmbientSoundscapeId)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
            >
              {AMBIENT_SOUNDSCAPES.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.labelGu} — {sc.labelEn}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Classroom Volume</span>
              <span className="font-mono-tabular text-cyan-300">
                {Math.round(ambientVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={Math.round(ambientVolume * 100)}
              onChange={(e) => setAmbientVolume(Number(e.target.value) / 100)}
              className="studio-slider w-full"
            />
          </label>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-300">Click &amp; VFX Sound Effects</span>
            <button
              type="button"
              onClick={() => setSfxEnabled(!sfxEnabled)}
              className={`px-3 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                sfxEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {sfxEnabled ? 'On' : 'Off'}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Subtle background soundscape designed for classrooms; automatically softens during voice narration.
          </p>
        </section>
      </div>
    </aside>
  );
};
