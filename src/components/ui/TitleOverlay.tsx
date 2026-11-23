import React from 'react';
import { Eye } from 'lucide-react';
import { DISTRICT_BY_ID } from '../../data/districtsDatabase';
import { useStudioStore } from '../../store/useStudioStore';
import { REGION_LABELS } from '../../types/gujarat';

export const TitleOverlay: React.FC = () => {
  const customTitleGu = useStudioStore((s) => s.customTitleGu);
  const textPosition = useStudioStore((s) => s.textPosition);
  const hoveredDistrictId = useStudioStore((s) => s.hoveredDistrictId);
  const activeRevealDistrictId = useStudioStore((s) => s.activeRevealDistrictId);
  const activeRegionReveal = useStudioStore((s) => s.activeRegionReveal);
  const activePreset = useStudioStore((s) => s.activePreset);
  const language = useStudioStore((s) => s.language);
  const cinemaMode = useStudioStore((s) => s.cinemaMode);
  const setCinemaMode = useStudioStore((s) => s.setCinemaMode);

  const spotlightId = activeRevealDistrictId || hoveredDistrictId;
  const spotlightDistrict = spotlightId ? DISTRICT_BY_ID[spotlightId] : null;

  const positionClass =
    textPosition === 'center'
      ? 'top-1/2 -translate-y-1/2'
      : textPosition === 'bottom'
      ? 'bottom-28'
      : 'top-4';

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center">
      {/* Editable Gujarati Cinematic Title */}
      {textPosition !== 'hidden' && customTitleGu.trim() !== '' && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 ${positionClass} max-w-[90vw] px-5 py-2 rounded-lg bg-[#070c18]/85 border border-cyan-500/25 text-center transition-all duration-200`}
        >
          <h1 className="font-display text-base md:text-xl font-semibold text-slate-50 tracking-wide whitespace-nowrap truncate">
            {customTitleGu}
          </h1>
        </div>
      )}

      {/* Active Region Reveal / Flyover / Hover Readout */}
      {(spotlightDistrict || activeRegionReveal) && (
        <div className="absolute top-16 left-5 max-w-xs px-4 py-2.5 rounded-lg bg-[#070c18]/92 border border-cyan-500/25">
          {activeRegionReveal ? (
            <div className="text-xs text-slate-200">
              <div className="text-cyan-300 font-semibold text-sm">
                {REGION_LABELS[activeRegionReveal][language]}
              </div>
              <div className="text-slate-400 mt-0.5">
                {REGION_LABELS[activeRegionReveal].en} · Gujarat Region Showcase
              </div>
            </div>
          ) : spotlightDistrict ? (
            <div className="text-xs text-slate-200">
              <div className="text-amber-300 font-semibold text-sm">
                {spotlightDistrict.nameGu} · {spotlightDistrict.nameEn}
              </div>
              <div className="text-slate-400 mt-0.5">
                {REGION_LABELS[spotlightDistrict.region].gu} · મુખ્ય મથક:{' '}
                {spotlightDistrict.headquarters.gu}
              </div>
              {activePreset === 'flyover' && (
                <div className="text-slate-300 mt-1 leading-relaxed line-clamp-2">
                  {spotlightDistrict.description.gu}
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Restore HUD button in Cinema Mode */}
      {cinemaMode && (
        <button
          type="button"
          onClick={() => setCinemaMode(false)}
          className="pointer-events-auto absolute top-4 right-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#070c18]/90 border border-cyan-500/35 text-xs font-medium text-cyan-200 hover:bg-cyan-500/20 transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Show Controls (H)</span>
        </button>
      )}
    </div>
  );
};
