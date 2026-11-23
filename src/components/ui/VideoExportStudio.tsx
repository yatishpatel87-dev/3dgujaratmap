import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Download, Film, Square, Video, X } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';

export const VideoExportStudio: React.FC = () => {
  const appMode = useStudioStore((s) => s.appMode);
  const setAppMode = useStudioStore((s) => s.setAppMode);
  const cinemaMode = useStudioStore((s) => s.cinemaMode);
  const canvasElement = useStudioStore((s) => s.canvasElement);
  const customTitleGu = useStudioStore((s) => s.customTitleGu);
  const textPosition = useStudioStore((s) => s.textPosition);
  const activePreset = useStudioStore((s) => s.activePreset);
  const setActivePreset = useStudioStore((s) => s.setActivePreset);
  const restartAnimation = useStudioStore((s) => s.restartAnimation);

  const [targetDuration, setTargetDuration] = useState(8);
  const [includeTitleOverlay, setIncludeTitleOverlay] = useState(true);
  const [format, setFormat] = useState<'webm' | 'mp4'>('webm');
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordedExt, setRecordedExt] = useState<'webm' | 'mp4'>('webm');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<number>(0);
  const chunksRef = useRef<BlobPart[]>([]);

  // Check real MediaRecorder browser capability (no fake conversions!)
  const supportInfo = useMemo(() => {
    if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
      return { webm: false, mp4: false, webmMime: '', mp4Mime: '' };
    }
    const webmMime =
      ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find((m) =>
        MediaRecorder.isTypeSupported(m)
      ) ?? '';
    const mp4Mime =
      ['video/mp4;codecs=avc1.42E01E', 'video/mp4'].find((m) =>
        MediaRecorder.isTypeSupported(m)
      ) ?? '';
    return {
      webm: Boolean(webmMime),
      mp4: Boolean(mp4Mime),
      webmMime,
      mp4Mime,
    };
  }, []);

  useEffect(() => {
    return () => {
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [recordedUrl]);

  if (appMode !== 'export' || cinemaMode) return null;

  const drawCompositeFrame = (
    destCanvas: HTMLCanvasElement,
    srcCanvas: HTMLCanvasElement
  ) => {
    const ctx = destCanvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(srcCanvas, 0, 0, destCanvas.width, destCanvas.height);

    if (includeTitleOverlay && textPosition !== 'hidden' && customTitleGu.trim()) {
      const boxW = Math.min(destCanvas.width * 0.78, 860);
      const boxH = 58;
      const x = (destCanvas.width - boxW) / 2;
      const y =
        textPosition === 'center'
          ? (destCanvas.height - boxH) / 2
          : textPosition === 'bottom'
          ? destCanvas.height - boxH - 36
          : 28;

      ctx.fillStyle = 'rgba(6, 11, 22, 0.85)';
      ctx.fillRect(x, y, boxW, boxH);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, boxW, boxH);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '700 26px "Noto Sans Gujarati", "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(customTitleGu, destCanvas.width / 2, y + boxH / 2);
    }
  };

  const handlePngScreenshot = () => {
    setErrorMsg(null);
    if (!canvasElement) {
      setErrorMsg('3D canvas is not ready yet.');
      return;
    }
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvasElement.width || 1280;
    exportCanvas.height = canvasElement.height || 720;
    drawCompositeFrame(exportCanvas, canvasElement);

    exportCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gujarat-3d-map-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const stopRecording = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const startRecording = () => {
    setErrorMsg(null);
    if (!canvasElement) {
      setErrorMsg('3D canvas is not ready yet.');
      return;
    }

    const useMp4 = format === 'mp4' && supportInfo.mp4;
    const mimeType = useMp4 ? supportInfo.mp4Mime : supportInfo.webmMime;
    if (!mimeType) {
      setErrorMsg('Video MediaRecorder is not supported in this browser.');
      return;
    }

    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      setRecordedUrl(null);
    }

    // Trigger active animation from start if static
    if (activePreset === 'none') {
      setActivePreset('reveal', true);
    } else {
      restartAnimation();
    }

    const composite = document.createElement('canvas');
    composite.width = canvasElement.width || 1280;
    composite.height = canvasElement.height || 720;

    const pump = () => {
      drawCompositeFrame(composite, canvasElement);
      rafRef.current = requestAnimationFrame(pump);
    };
    pump();

    const stream = composite.captureStream(30);
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 4_000_000,
    });

    chunksRef.current = [];
    recorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
    };
    recorder.onstop = () => {
      const ext = useMp4 ? 'mp4' : 'webm';
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setRecordedExt(ext);
      setRecordedUrl(url);
    };

    recorderRef.current = recorder;
    recorder.start(250);
    setIsRecording(true);
    setElapsedSec(0);

    const startedAt = Date.now();
    timerRef.current = window.setInterval(() => {
      const secs = (Date.now() - startedAt) / 1000;
      setElapsedSec(secs);
      if (secs >= targetDuration) {
        stopRecording();
      }
    }, 100);
  };

  const progressPct = Math.min(100, Math.round((elapsedSec / targetDuration) * 100));

  return (
    <aside className="absolute top-4 right-4 bottom-24 w-[min(400px,92vw)] z-20 rounded-xl bg-[#080e1d]/95 border border-cyan-500/25 shadow-2xl flex flex-col overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-800/90 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-cyan-400" />
          <h2 className="font-display text-base font-semibold text-white">
            Video Export Studio
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setAppMode('explore')}
          aria-label="Close Export Studio"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-xs">
        {/* PNG Screenshot Export */}
        <section className="space-y-2.5">
          <div className="text-slate-300 font-semibold">High-Res Screenshot</div>
          <button
            type="button"
            onClick={handlePngScreenshot}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 text-slate-100 font-medium hover:bg-slate-700 border border-slate-700 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-cyan-300" />
            <span>Export PNG Screenshot</span>
          </button>
        </section>

        {/* Video Recording Settings */}
        <section className="space-y-3 pt-3 border-t border-slate-800/80">
          <div className="text-slate-300 font-semibold">Canvas Video Recording</div>

          <label className="block space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Recording Duration</span>
              <span className="font-mono-tabular text-cyan-300">{targetDuration}s</span>
            </div>
            <input
              type="range"
              min={4}
              max={20}
              step={1}
              disabled={isRecording}
              value={targetDuration}
              onChange={(e) => setTargetDuration(Number(e.target.value))}
              className="studio-slider w-full"
            />
          </label>

          <label className="flex items-center justify-between gap-2 text-slate-300 cursor-pointer">
            <span>Include Gujarati Title Overlay</span>
            <input
              type="checkbox"
              checked={includeTitleOverlay}
              onChange={(e) => setIncludeTitleOverlay(e.target.checked)}
              className="accent-cyan-400 w-4 h-4"
            />
          </label>

          <div className="space-y-1.5">
            <div className="text-slate-300">Video Format (Browser MediaRecorder)</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!supportInfo.webm || isRecording}
                onClick={() => setFormat('webm')}
                className={`py-2 rounded-lg border font-medium cursor-pointer disabled:opacity-40 ${
                  format === 'webm'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                WebM {supportInfo.webm ? '(Supported)' : '(Unavailable)'}
              </button>
              <button
                type="button"
                disabled={!supportInfo.mp4 || isRecording}
                onClick={() => setFormat('mp4')}
                className={`py-2 rounded-lg border font-medium cursor-pointer disabled:opacity-40 ${
                  format === 'mp4'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                MP4 {supportInfo.mp4 ? '(Supported)' : '(Not Native)'}
              </button>
            </div>
          </div>

          {!isRecording ? (
            <button
              type="button"
              disabled={!supportInfo.webm && !supportInfo.mp4}
              onClick={startRecording}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 disabled:opacity-40 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Start Recording Animation</span>
            </button>
          ) : (
            <div className="space-y-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/35">
              <div className="flex items-center justify-between font-mono-tabular text-rose-200">
                <span>Recording...</span>
                <span>
                  {elapsedSec.toFixed(1)}s / {targetDuration}s
                </span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded overflow-hidden">
                <div
                  className="h-full bg-rose-400 transition-all duration-100"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <button
                type="button"
                onClick={stopRecording}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-400 cursor-pointer"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Stop Early</span>
              </button>
            </div>
          )}

          {errorMsg && <p className="text-rose-400">{errorMsg}</p>}
        </section>

        {/* Playback & Real Download */}
        {recordedUrl && (
          <section className="space-y-3 pt-3 border-t border-slate-800/80">
            <div className="text-emerald-300 font-semibold">
              Recorded Video Ready ({recordedExt.toUpperCase()})
            </div>
            <video
              controls
              src={recordedUrl}
              className="w-full rounded-lg border border-slate-800 bg-black"
            />
            <a
              href={recordedUrl}
              download={`gujarat-vfx-studio.${recordedExt}`}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download {recordedExt.toUpperCase()} Video</span>
            </a>
          </section>
        )}
      </div>
    </aside>
  );
};
