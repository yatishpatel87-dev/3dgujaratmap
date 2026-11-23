import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  Loader2,
  Pause,
  Play,
  Radio,
  Search,
  Sparkles,
  Square,
  Volume2,
  X,
} from 'lucide-react';
import { DISTRICTS_DB, DISTRICT_BY_ID } from '../../data/districtsDatabase';
import { DISTRICT_SPECIALTIES } from '../../data/districtSpecialties';
import { useStudioStore } from '../../store/useStudioStore';
import { DistrictRecord, Language, REGION_LABELS } from '../../types/gujarat';
import { buildDistrictNarrationSegments } from '../../utils/districtNarration';
import { soundEffects } from '../../utils/soundEffects';
import {
  SARVAM_SPEAKERS,
  SarvamSpeakerId,
  speechController,
} from '../../utils/speechUtils';

const FIELD_LABELS: Record<
  Language,
  {
    titleGu: string;
    titleEn: string;
    hq: string;
    geo: string;
    area: string;
    rivers: string;
    crops: string;
    industries: string;
    attractions: string;
    history: string;
    studied: string;
    listenAll: string;
    pause: string;
    resume: string;
    stop: string;
    goldenFocus: string;
    tourAll: string;
    tourRunning: string;
    autoReadClick: string;
    nowReading: string;
    clickSectionHint: string;
  }
> = {
  gu: {
    titleGu: 'જિલ્લાનું ગુજરાતી નામ',
    titleEn: 'જિલ્લાનું અંગ્રેજી નામ',
    hq: 'જિલ્લાનું મુખ્ય મથક',
    geo: 'જિલ્લાની ભૌગોલિક ઓળખ',
    area: 'ક્ષેત્રફળ (ચો.કિ.મી.)',
    rivers: 'મુખ્ય નદીઓ',
    crops: 'મુખ્ય પાક',
    industries: 'ઉદ્યોગો',
    attractions: 'જોવાલાયક સ્થળો',
    history: 'ઐતિહાસિક માહિતી',
    studied: 'અભ્યાસ કરેલ',
    listenAll: 'બધી માહિતી સાંભળો',
    pause: 'થોભાવો',
    resume: 'ચાલુ કરો',
    stop: 'બંધ કરો',
    goldenFocus: 'ગોલ્ડન હાઇલાઇટ',
    tourAll: 'બધા જિલ્લા વાંચો (૧→૩૪)',
    tourRunning: 'ક્રમશઃ વાંચન ચાલુ',
    autoReadClick: 'ક્લિક પર આપમેળે વાંચો',
    nowReading: 'અત્યારે વંચાઈ રહ્યું છે',
    clickSectionHint: 'કોઈપણ વિભાગ પર ક્લિક કરીને ત્યાંથી ક્રમશઃ સાંભળો',
  },
  en: {
    titleGu: 'Gujarati Name',
    titleEn: 'English Name',
    hq: 'District Headquarters',
    geo: 'Geographical Location',
    area: 'Area (sq. km)',
    rivers: 'Important Rivers',
    crops: 'Major Crops',
    industries: 'Industries',
    attractions: 'Tourist Attractions',
    history: 'Historical Importance',
    studied: 'Studied',
    listenAll: 'Read All Info',
    pause: 'Pause',
    resume: 'Resume',
    stop: 'Stop',
    goldenFocus: 'Golden Highlight',
    tourAll: 'Auto-Tour All (1→34)',
    tourRunning: 'Auto-Tour Active',
    autoReadClick: 'Auto-Read on Click',
    nowReading: 'Now Reading',
    clickSectionHint: 'Click any section below to listen sequentially from there',
  },
  hi: {
    titleGu: 'जिले का गुजराती नाम',
    titleEn: 'जिले का अंग्रेजी नाम',
    hq: 'जिला मुख्यालय',
    geo: 'भौगोलिक स्थिति',
    area: 'क्षेत्रफल (वर्ग किमी)',
    rivers: 'प्रमुख नदियाँ',
    crops: 'प्रमुख फसलें',
    industries: 'उद्योग',
    attractions: 'दर्शनीय स्थल',
    history: 'ऐतिहासिक महत्व',
    studied: 'अध्ययन पूर्ण',
    listenAll: 'पूरी जानकारी सुनें',
    pause: 'रोकें',
    resume: 'जारी रखें',
    stop: 'बंद करें',
    goldenFocus: 'गोल्डन हाइलाइट',
    tourAll: 'सभी जिले क्रमिक पढ़ें (1→34)',
    tourRunning: 'क्रमिक वाचन चालू',
    autoReadClick: 'क्लिक पर स्वतः पढ़ें',
    nowReading: 'अभी पढ़ा जा रहा है',
    clickSectionHint: 'किसी भी भाग पर क्लिक करके वहाँ से क्रमिक सुनें',
  },
};

export const LearnPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [activeSegmentLabel, setActiveSegmentLabel] = useState<string | null>(null);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [totalSegments, setTotalSegments] = useState(0);
  const [sarvamConfigured, setSarvamConfigured] = useState<boolean | null>(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState<SarvamSpeakerId>(() =>
    speechController.getSpeaker()
  );

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastAutoKeyRef = useRef<string | null>(null);

  const appMode = useStudioStore((s) => s.appMode);
  const setAppMode = useStudioStore((s) => s.setAppMode);
  const cinemaMode = useStudioStore((s) => s.cinemaMode);
  const language = useStudioStore((s) => s.language);
  const setLanguage = useStudioStore((s) => s.setLanguage);
  const selectedDistrictId = useStudioStore((s) => s.selectedDistrictId);
  const setSelectedDistrictId = useStudioStore((s) => s.setSelectedDistrictId);
  const studiedDistrictIds = useStudioStore((s) => s.studiedDistrictIds);
  const setActivePreset = useStudioStore((s) => s.setActivePreset);
  const autoTourDistricts = useStudioStore((s) => s.autoTourDistricts);
  const setAutoTourDistricts = useStudioStore((s) => s.setAutoTourDistricts);
  const autoReadOnSelect = useStudioStore((s) => s.autoReadOnSelect);
  const setAutoReadOnSelect = useStudioStore((s) => s.setAutoReadOnSelect);

  const district =
    (selectedDistrictId && DISTRICT_BY_ID[selectedDistrictId]) || DISTRICTS_DB[0];

  const startDistrictNarration = useCallback(
    (targetDistrict: DistrictRecord, startSegmentIndex = 0) => {
      const segments = buildDistrictNarrationSegments(targetDistrict, language);
      void speechController.speakSequence(segments, language, {
        startIndex: startSegmentIndex,
        onSequenceComplete: () => {
          const state = useStudioStore.getState();
          if (!state.autoTourDistricts || state.appMode !== 'learn') return;
          const currentIdx = DISTRICTS_DB.findIndex((d) => d.id === targetDistrict.id);
          if (currentIdx >= 0 && currentIdx < DISTRICTS_DB.length - 1) {
            const nextDistrict = DISTRICTS_DB[currentIdx + 1];
            soundEffects.playDistrictSelect();
            state.setSelectedDistrictId(nextDistrict.id, true);
          } else {
            state.setAutoTourDistricts(false);
          }
        },
      });
    },
    [language]
  );

  useEffect(() => {
    void speechController.checkSarvamStatus().then((ok) => {
      setSarvamConfigured(ok);
    });
    const unsub = speechController.subscribe((state) => {
      setSpeaking(state.speaking);
      setPaused(state.paused);
      setVoiceLoading(state.loading);
      setActiveSegmentId(state.activeSegmentId);
      setActiveSegmentLabel(state.activeSegmentLabel);
      setSegmentIndex(state.segmentIndex);
      setTotalSegments(state.totalSegments);
    });
    return () => {
      unsub();
      speechController.stop();
    };
  }, []);

  // Scroll highlighted section smoothly into view while reading one-by-one
  useEffect(() => {
    if (!activeSegmentId) return;
    const el = sectionRefs.current[activeSegmentId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSegmentId]);

  // Coordinate sequential auto-reading & 1..34 auto-tour across district/language/mode changes
  useEffect(() => {
    if (appMode !== 'learn') {
      speechController.stop();
      if (autoTourDistricts) {
        setAutoTourDistricts(false);
      }
      lastAutoKeyRef.current = null;
      return;
    }

    if (autoTourDistricts || autoReadOnSelect) {
      const modeTag = autoTourDistricts ? 'tour' : 'read';
      const key = `${district.id}:${language}:${modeTag}`;
      if (lastAutoKeyRef.current !== key) {
        lastAutoKeyRef.current = key;
        startDistrictNarration(district, 0);
      }
      return;
    }

    lastAutoKeyRef.current = null;
    speechController.stop();
  }, [
    district,
    language,
    appMode,
    autoTourDistricts,
    autoReadOnSelect,
    setAutoTourDistricts,
    startDistrictNarration,
  ]);

  const filteredDistricts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return DISTRICTS_DB;
    return DISTRICTS_DB.filter(
      (d) =>
        d.nameEn.toLowerCase().includes(q) ||
        d.nameGu.includes(q) ||
        d.headquarters.en.toLowerCase().includes(q) ||
        d.headquarters.gu.includes(q)
    );
  }, [searchQuery]);

  if (appMode !== 'learn' || cinemaMode) return null;

  const labels = FIELD_LABELS[language];
  const isStudied = studiedDistrictIds.includes(district.id);
  const currentDbIndex = DISTRICTS_DB.findIndex((d) => d.id === district.id);

  const handleNarration = () => {
    if (speaking && !paused) {
      speechController.pause();
      return;
    }
    if (speaking && paused) {
      speechController.resume();
      return;
    }
    if (voiceLoading) {
      speechController.stop();
      return;
    }

    startDistrictNarration(district, 0);
  };

  const handleStopAll = () => {
    speechController.stop();
    if (autoTourDistricts) {
      setAutoTourDistricts(false);
    }
  };

  const handleToggleAutoTour = () => {
    if (autoTourDistricts) {
      setAutoTourDistricts(false);
      speechController.stop();
      lastAutoKeyRef.current = null;
    } else {
      lastAutoKeyRef.current = `${district.id}:${language}:tour`;
      setAutoTourDistricts(true);
      startDistrictNarration(district, 0);
    }
  };

  const handleStepDistrict = (delta: number) => {
    const nextIdx =
      (currentDbIndex + delta + DISTRICTS_DB.length) % DISTRICTS_DB.length;
    const next = DISTRICTS_DB[nextIdx];
    soundEffects.playDistrictSelect();
    setSelectedDistrictId(next.id, true);
  };

  const handleSpeakFromSection = (segmentId: string) => {
    const segments = buildDistrictNarrationSegments(district, language);
    const idx = segments.findIndex((s) => s.id === segmentId);
    if (idx >= 0) {
      startDistrictNarration(district, idx);
    }
  };

  const handleSpeakerChange = (speakerId: SarvamSpeakerId) => {
    setSelectedSpeaker(speakerId);
    speechController.setSpeaker(speakerId);
    if (speaking || voiceLoading) {
      speechController.stop();
      lastAutoKeyRef.current = null;
    }
  };

  const sectionCardClass = (segId: string) =>
    `rounded-lg px-3 py-2 transition-all cursor-pointer border ${
      activeSegmentId === segId
        ? 'bg-cyan-500/15 border-cyan-400/60 shadow-[0_0_16px_rgba(34,211,238,0.18)]'
        : 'bg-transparent border-transparent hover:bg-slate-800/40 hover:border-slate-800'
    }`;

  return (
    <aside className="absolute top-4 right-4 bottom-24 w-[min(455px,93vw)] z-20 rounded-xl bg-[#080e1d]/95 border border-cyan-500/25 shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-800/90 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-cyan-300 font-medium">
            જિલ્લો {district.number} / 34 · {studiedDistrictIds.length} {labels.studied}
          </p>
          <h2 className="font-display text-xl font-bold text-white mt-0.5">
            {district.nameGu} · {district.nameEn}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setAppMode('explore')}
          aria-label="Close Learn Panel"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Language + District Picker Bar */}
      <div className="px-5 py-2.5 border-b border-slate-800/70 flex flex-col gap-2 bg-[#060b16]/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800">
            {(
              [
                { id: 'gu', label: 'ગુજરાતી' },
                { id: 'en', label: 'English' },
                { id: 'hi', label: 'हिन्दी' },
              ] as { id: Language; label: string }[]
            ).map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLanguage(l.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  language === l.id
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setActivePreset('golden', true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-medium hover:bg-amber-400/25 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{labels.goldenFocus}</span>
          </button>
        </div>

        {/* Search & Quick Select + Prev/Next */}
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="જિલ્લો શોધો..."
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="button"
            onClick={() => handleStepDistrict(-1)}
            title="Previous District"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <select
            value={district.id}
            onChange={(e) => setSelectedDistrictId(e.target.value, true)}
            aria-label="Select Gujarat district"
            className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 max-w-[148px]"
          >
            {filteredDistricts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.number}. {d.nameGu} ({d.nameEn})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => handleStepDistrict(1)}
            title="Next District"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sequential Narration & 34-District Auto-Tour Controls */}
      <div className="px-5 py-2.5 border-b border-slate-800/70 space-y-2 bg-slate-900/45">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <button
              type="button"
              onClick={handleNarration}
              disabled={!speechController.isSupported()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-500 text-slate-950 text-xs font-semibold hover:bg-cyan-400 disabled:opacity-40 transition-colors cursor-pointer whitespace-nowrap"
            >
              {voiceLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{language === 'gu' ? 'અવાજ તૈયાર...' : 'Generating...'}</span>
                </>
              ) : speaking && !paused ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>{labels.pause}</span>
                </>
              ) : speaking && paused ? (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>{labels.resume}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>{labels.listenAll}</span>
                </>
              )}
            </button>

            {(speaking || voiceLoading || autoTourDistricts) && (
              <button
                type="button"
                onClick={handleStopAll}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 text-slate-200 text-xs hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Square className="w-3 h-3" />
                <span>{labels.stop}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleAutoTour}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
              autoTourDistricts
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-amber-400/15 text-amber-300 border-amber-400/40 hover:bg-amber-400/25'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>{autoTourDistricts ? labels.tourRunning : labels.tourAll}</span>
          </button>
        </div>

        {/* Live Now-Reading Progress Indicator */}
        {(speaking || voiceLoading) && activeSegmentLabel && (
          <div className="px-3 py-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 text-cyan-200 font-medium truncate">
              <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">
                {labels.nowReading}: {activeSegmentLabel}
              </span>
            </span>
            <span className="font-mono-tabular text-[11px] text-cyan-300 shrink-0">
              {segmentIndex + 1}/{totalSegments}
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAutoReadOnSelect(!autoReadOnSelect)}
              className={`px-2 py-0.5 rounded border text-[11px] font-medium transition-colors cursor-pointer ${
                autoReadOnSelect
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {labels.autoReadClick}: {autoReadOnSelect ? 'ON' : 'OFF'}
            </button>
            <span
              className={
                sarvamConfigured ? 'text-emerald-300 font-medium' : 'text-slate-400'
              }
            >
              {sarvamConfigured === true
                ? 'Sarvam AI સક્રિય'
                : sarvamConfigured === false
                ? 'Browser Voice'
                : 'Checking...'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isStudied && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium whitespace-nowrap">
                <CheckCircle2 className="w-3 h-3" />
                <span>{labels.studied}</span>
              </span>
            )}
            <select
              value={selectedSpeaker}
              onChange={(e) => handleSpeakerChange(e.target.value as SarvamSpeakerId)}
              aria-label="Sarvam AI Voice Speaker"
              className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200 text-[11px] focus:outline-none focus:border-cyan-500"
            >
              {SARVAM_SPEAKERS.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {language === 'gu' ? sp.labelGu : sp.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scrollable Educational Content — Clickable & Auto-Highlighted One-by-One */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 text-sm">
        <p className="px-1 text-[11px] text-slate-400">{labels.clickSectionHint}</p>

        {/* Segment 1: Intro + Headquarters + Overview */}
        <div
          ref={(el) => {
            sectionRefs.current.intro = el;
          }}
          onClick={() => handleSpeakFromSection('intro')}
          className={sectionCardClass('intro')}
        >
          <p className="text-slate-200 leading-relaxed">{district.description[language]}</p>
          <div className="grid grid-cols-2 gap-3 pt-2.5 mt-2.5 border-t border-slate-800/80">
            <div>
              <div className="text-xs text-slate-400">{labels.titleGu}</div>
              <div className="font-semibold text-slate-100 mt-0.5">{district.nameGu}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">{labels.titleEn}</div>
              <div className="font-semibold text-slate-100 mt-0.5">{district.nameEn}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-slate-400">{labels.hq}</div>
              <div className="font-semibold text-cyan-300 mt-0.5">
                {district.headquarters[language]}
              </div>
            </div>
          </div>
        </div>

        {/* Segment 2: 3D Map Specialty Highlight */}
        {DISTRICT_SPECIALTIES[district.id] && (
          <div
            ref={(el) => {
              sectionRefs.current.specialty = el;
            }}
            onClick={() => handleSpeakFromSection('specialty')}
            className={`px-3.5 py-2.5 rounded-lg border cursor-pointer transition-all ${
              activeSegmentId === 'specialty'
                ? 'bg-amber-400/20 border-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.2)]'
                : 'bg-amber-400/10 border-amber-400/30 hover:bg-amber-400/15'
            }`}
          >
            <div className="text-[11px] font-semibold text-amber-300 uppercase tracking-wide">
              {language === 'gu'
                ? '૩D નકશાની મુખ્ય વિશેષતા'
                : language === 'hi'
                ? '3D मानचित्र की प्रमुख विशेषता'
                : '3D Map Specialty Highlight'}
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              {DISTRICT_SPECIALTIES[district.id].title[language]}
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              {DISTRICT_SPECIALTIES[district.id].subtitle[language]}
            </div>
          </div>
        )}

        {/* Segment 3: Geographical Location & Area */}
        <div
          ref={(el) => {
            sectionRefs.current.geo = el;
          }}
          onClick={() => handleSpeakFromSection('geo')}
          className={sectionCardClass('geo')}
        >
          <div className="text-xs text-cyan-300/90 font-medium">
            {labels.geo} · {REGION_LABELS[district.region][language]}
          </div>
          <div className="text-slate-200 mt-0.5 leading-relaxed">
            {district.geoLocation[language]}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/70 flex items-center justify-between text-xs">
            <span className="text-slate-400">{labels.area}</span>
            <span className="font-mono-tabular font-semibold text-slate-100">
              {district.areaSqKm === 'માહિતી ઉપલબ્ધ નથી' && language !== 'gu'
                ? language === 'en'
                  ? 'Not available'
                  : 'जानकारी उपलब्ध नहीं है'
                : district.areaSqKm}
            </span>
          </div>
        </div>

        {/* Segment 4: Rivers */}
        <div
          ref={(el) => {
            sectionRefs.current.rivers = el;
          }}
          onClick={() => handleSpeakFromSection('rivers')}
          className={sectionCardClass('rivers')}
        >
          <div className="text-xs text-cyan-300/90 font-medium">{labels.rivers}</div>
          <div className="text-slate-200 mt-0.5 leading-relaxed">
            {district.rivers[language]}
          </div>
        </div>

        {/* Segment 5: Crops */}
        <div
          ref={(el) => {
            sectionRefs.current.crops = el;
          }}
          onClick={() => handleSpeakFromSection('crops')}
          className={sectionCardClass('crops')}
        >
          <div className="text-xs text-cyan-300/90 font-medium">{labels.crops}</div>
          <div className="text-slate-200 mt-0.5 leading-relaxed">
            {district.crops[language]}
          </div>
        </div>

        {/* Segment 6: Industries */}
        <div
          ref={(el) => {
            sectionRefs.current.industries = el;
          }}
          onClick={() => handleSpeakFromSection('industries')}
          className={sectionCardClass('industries')}
        >
          <div className="text-xs text-cyan-300/90 font-medium">{labels.industries}</div>
          <div className="text-slate-200 mt-0.5 leading-relaxed">
            {district.industries[language]}
          </div>
        </div>

        {/* Segment 7: Attractions */}
        <div
          ref={(el) => {
            sectionRefs.current.attractions = el;
          }}
          onClick={() => handleSpeakFromSection('attractions')}
          className={sectionCardClass('attractions')}
        >
          <div className="text-xs text-cyan-300/90 font-medium">{labels.attractions}</div>
          <div className="text-slate-200 mt-0.5 leading-relaxed">
            {district.attractions[language]}
          </div>
        </div>

        {/* Segment 8: History */}
        <div
          ref={(el) => {
            sectionRefs.current.history = el;
          }}
          onClick={() => handleSpeakFromSection('history')}
          className={sectionCardClass('history')}
        >
          <div className="text-xs text-cyan-300/90 font-medium">{labels.history}</div>
          <div className="text-slate-200 mt-0.5 leading-relaxed">
            {district.history[language]}
          </div>
        </div>
      </div>
    </aside>
  );
};
