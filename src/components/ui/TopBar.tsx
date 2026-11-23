import React from 'react';
import { BookOpen } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { AppMode } from '../../types/gujarat';

const NAV_ITEMS: { id: AppMode; labelGu: string; labelEn: string }[] = [
  { id: 'explore', labelGu: '3D નકશો', labelEn: '3D Map' },
  { id: 'vfx', labelGu: 'VFX સ્ટુડિયો', labelEn: 'VFX Studio' },
  { id: 'quiz', labelGu: 'ક્વિઝ ગેમ', labelEn: 'Quiz Game' },
  { id: 'teacher', labelGu: 'શિક્ષક પેનલ', labelEn: 'Teacher' },
  { id: 'export', labelGu: 'વીડિયો એક્સપોર્ટ', labelEn: 'Export' },
];

export const TopBar: React.FC = () => {
  const appMode = useStudioStore((s) => s.appMode);
  const setAppMode = useStudioStore((s) => s.setAppMode);
  const language = useStudioStore((s) => s.language);
  const cinemaMode = useStudioStore((s) => s.cinemaMode);

  if (cinemaMode) return null;

  return (
    <header className="h-14 px-6 bg-[#070c18]/95 border-b border-cyan-500/20 flex items-center justify-between gap-8 shrink-0 z-30 select-none">
      {/* Zone 1: Single-line Brand Title */}
      <button
        type="button"
        onClick={() => setAppMode('explore')}
        className="font-display text-base md:text-lg font-semibold tracking-tight text-slate-50 hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        Gujarat District VFX Studio
      </button>

      {/* Zone 2: Concise single-line mode links */}
      <nav className="hidden lg:flex items-center gap-6">
        {NAV_ITEMS.map((item) => {
          const active = appMode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setAppMode(item.id)}
              className={`relative py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active ? 'text-cyan-300' : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'en' ? item.labelEn : item.labelGu}
              {active && (
                <span className="absolute left-0 right-0 -bottom-[11px] h-[2px] bg-cyan-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Single Primary Educational CTA */}
      <div className="shrink-0">
        <button
          type="button"
          onClick={() => setAppMode(appMode === 'learn' ? 'explore' : 'learn')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            appMode === 'learn'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>ગુજરાતને ઓળખો – Learn Gujarat</span>
        </button>
      </div>
    </header>
  );
};
