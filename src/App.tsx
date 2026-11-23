import React, { useEffect } from 'react';
import { GujaratMapScene } from './components/scene/GujaratMapScene';
import { BottomDock } from './components/ui/BottomDock';
import { LearnPanel } from './components/ui/LearnPanel';
import { QuizGameModal } from './components/ui/QuizGameModal';
import { TeacherDashboard } from './components/ui/TeacherDashboard';
import { TitleOverlay } from './components/ui/TitleOverlay';
import { TopBar } from './components/ui/TopBar';
import { VfxEditorPanel } from './components/ui/VfxEditorPanel';
import { VideoExportStudio } from './components/ui/VideoExportStudio';
import { useStudioStore } from './store/useStudioStore';
import { ambientAudioManager } from './utils/ambientAudio';
import { soundEffects } from './utils/soundEffects';

export function App() {
  const cinemaMode = useStudioStore((s) => s.cinemaMode);
  const setCinemaMode = useStudioStore((s) => s.setCinemaMode);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'h' || e.key === 'H') {
        setCinemaMode(!useStudioStore.getState().cinemaMode);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setCinemaMode]);

  useEffect(() => {
    return () => {
      ambientAudioManager.dispose();
      soundEffects.dispose();
    };
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#060B16] text-slate-100 overflow-hidden select-none">
      <TopBar />

      <main className="relative flex-1 w-full h-full overflow-hidden">
        <GujaratMapScene />
        <TitleOverlay />
        <BottomDock />
        <LearnPanel />
        <VfxEditorPanel />
        <VideoExportStudio />
        <QuizGameModal />
        <TeacherDashboard />

        {!cinemaMode && (
          <div className="pointer-events-none hidden sm:block absolute bottom-4 left-5 z-10 text-[11px] text-slate-400">
            <span>Gujarat State · 34 Districts · Drag to Orbit · Scroll to Zoom</span>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
