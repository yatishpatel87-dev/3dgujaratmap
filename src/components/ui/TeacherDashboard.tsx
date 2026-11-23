import React, { useState } from 'react';
import {
  CheckCircle2,
  Maximize2,
  Plus,
  Presentation,
  RotateCcw,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { DISTRICTS_DB } from '../../data/districtsDatabase';
import { useStudioStore } from '../../store/useStudioStore';
import { AmbientSoundscapeId, QuizDifficulty, QuizMode, QuizQuestion } from '../../types/gujarat';
import { AMBIENT_SOUNDSCAPES } from '../../utils/ambientAudio';

export const TeacherDashboard: React.FC = () => {
  const appMode = useStudioStore((s) => s.appMode);
  const setAppMode = useStudioStore((s) => s.setAppMode);
  const studiedDistrictIds = useStudioStore((s) => s.studiedDistrictIds);
  const quizHistory = useStudioStore((s) => s.quizHistory);
  const totalCorrect = useStudioStore((s) => s.totalCorrect);
  const totalIncorrect = useStudioStore((s) => s.totalIncorrect);
  const quizDifficulty = useStudioStore((s) => s.quizDifficulty);
  const setQuizDifficulty = useStudioStore((s) => s.setQuizDifficulty);
  const customQuestions = useStudioStore((s) => s.customQuestions);
  const addCustomQuestion = useStudioStore((s) => s.addCustomQuestion);
  const deleteCustomQuestion = useStudioStore((s) => s.deleteCustomQuestion);
  const resetDemoProgress = useStudioStore((s) => s.resetDemoProgress);
  const setActivePreset = useStudioStore((s) => s.setActivePreset);
  const setSelectedDistrictId = useStudioStore((s) => s.setSelectedDistrictId);
  const ambientEnabled = useStudioStore((s) => s.ambientEnabled);
  const setAmbientEnabled = useStudioStore((s) => s.setAmbientEnabled);
  const ambientSoundscape = useStudioStore((s) => s.ambientSoundscape);
  const setAmbientSoundscape = useStudioStore((s) => s.setAmbientSoundscape);
  const ambientVolume = useStudioStore((s) => s.ambientVolume);
  const setAmbientVolume = useStudioStore((s) => s.setAmbientVolume);
  const sfxEnabled = useStudioStore((s) => s.sfxEnabled);
  const setSfxEnabled = useStudioStore((s) => s.setSfxEnabled);

  const [confirmReset, setConfirmReset] = useState(false);

  // Custom question form state
  const [qTextGu, setQTextGu] = useState('');
  const [qDistrictId, setQDistrictId] = useState('ahmedabad');
  const [qMode, setQMode] = useState<QuizMode>('identification');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [qExplain, setQExplain] = useState('');
  const [formSavedMsg, setFormSavedMsg] = useState(false);

  if (appMode !== 'teacher') return null;

  const completionPct = Math.round((studiedDistrictIds.length / DISTRICTS_DB.length) * 100);
  const avgQuizScore =
    quizHistory.length > 0
      ? Math.round(
          quizHistory.reduce((acc, r) => acc + (r.correctCount / r.totalQuestions) * 100, 0) /
            quizHistory.length
        )
      : 0;

  const handleStartClassroomDemo = () => {
    setAppMode('explore');
    setActivePreset('regionReveal', true);
  };

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore if sandboxed iframe blocks fullscreen
    }
  };

  const handleAddCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTextGu.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) return;

    const newQ: QuizQuestion = {
      id: `custom-${Date.now()}`,
      mode: qMode,
      difficulty: quizDifficulty,
      districtId: qDistrictId,
      isCustom: true,
      question: { gu: qTextGu.trim(), en: qTextGu.trim(), hi: qTextGu.trim() },
      options: [
        { gu: optA.trim(), en: optA.trim(), hi: optA.trim() },
        { gu: optB.trim(), en: optB.trim(), hi: optB.trim() },
        { gu: optC.trim(), en: optC.trim(), hi: optC.trim() },
        { gu: optD.trim(), en: optD.trim(), hi: optD.trim() },
      ],
      correctIndex: correctIdx,
      explanation: {
        gu: qExplain.trim() || 'શિક્ષક દ્વારા ઉમેરેલ પ્રશ્ન.',
        en: qExplain.trim() || 'Teacher custom question.',
        hi: qExplain.trim() || 'शिक्षक द्वारा जोड़ा गया प्रश्न।',
      },
    };
    addCustomQuestion(newQ);
    setQTextGu('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setQExplain('');
    setFormSavedMsg(true);
    window.setTimeout(() => setFormSavedMsg(false), 2500);
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-[#040812]/85">
      <div className="w-[min(1080px,96vw)] max-h-[90vh] rounded-2xl bg-[#080e1d] border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-amber-300 font-medium">
              Demo Records (Local Browser Storage) · ડેમો ડેટા (લોકલ સ્ટોરેજ)
            </p>
            <h2 className="font-display text-xl font-bold text-white mt-0.5">
              Teacher Classroom Dashboard · શિક્ષક ડેશબોર્ડ
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleStartClassroomDemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-semibold hover:bg-cyan-400 cursor-pointer"
            >
              <Presentation className="w-4 h-4" />
              <span>Start Classroom Map Demo</span>
            </button>

            <button
              type="button"
              onClick={handleFullscreen}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fullscreen</span>
            </button>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium hover:bg-rose-500/25 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-rose-950/60 border border-rose-500/40 px-2.5 py-1 rounded-lg">
                <span className="text-xs text-rose-200">Confirm reset?</span>
                <button
                  type="button"
                  onClick={() => {
                    resetDemoProgress();
                    setConfirmReset(false);
                  }}
                  className="px-2 py-0.5 rounded bg-rose-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 text-xs cursor-pointer"
                >
                  No
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setAppMode('explore')}
              aria-label="Close Teacher Dashboard"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 5 KPI Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono-tabular">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400">Districts Studied</div>
              <div className="text-2xl font-bold text-cyan-300 mt-1">
                {studiedDistrictIds.length} / 34
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400">Completion</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{completionPct}%</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400">Avg Quiz Score</div>
              <div className="text-2xl font-bold text-amber-300 mt-1">{avgQuizScore}%</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400">Correct Answers</div>
              <div className="text-2xl font-bold text-emerald-300 mt-1">{totalCorrect}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400">Incorrect Answers</div>
              <div className="text-2xl font-bold text-rose-300 mt-1">{totalIncorrect}</div>
            </div>
          </div>

          {/* Two-column layout: District Progress + Quiz Settings & Custom Questions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: District-wise Learning Progress + Quiz History */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">
                    District-wise Learning Progress (34 Districts)
                  </h3>
                  <span className="text-xs text-slate-400">Click to view on 3D Map</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-60 overflow-y-auto pr-1">
                  {DISTRICTS_DB.map((d) => {
                    const done = studiedDistrictIds.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setSelectedDistrictId(d.id, true);
                          setAppMode('learn');
                        }}
                        className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-md border text-xs text-left transition-colors cursor-pointer ${
                          done
                            ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-200'
                            : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{d.nameGu}</span>
                        {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-2">
                  Recent Student Quiz Progress (Demo Records)
                </h3>
                {quizHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 border border-dashed border-slate-800 rounded-lg text-center">
                    No quiz sessions recorded yet.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {quizHistory.map((r) => (
                      <div
                        key={r.id}
                        className="px-3.5 py-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-100">{r.studentName}</div>
                          <div className="text-slate-400">
                            {r.mode} · {r.difficulty} · {r.totalQuestions} Qs
                          </div>
                        </div>
                        <div className="text-right font-mono-tabular">
                          <div className="text-cyan-300 font-semibold">
                            {r.correctCount}/{r.totalQuestions} ({r.score} pts)
                          </div>
                          <div className="text-amber-300">{r.stars}/5 Stars</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Quiz Difficulty & Custom Question Creator */}
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
                <div className="text-sm font-semibold text-white">
                  Quiz Difficulty Setting · ક્વિઝ મુશ્કેલી સ્તર
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'easy', label: 'Easy · સરળ' },
                      { id: 'medium', label: 'Medium · મધ્યમ' },
                      { id: 'hard', label: 'Hard · કઠિન' },
                    ] as { id: QuizDifficulty; label: string }[]
                  ).map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setQuizDifficulty(d.id)}
                      className={`py-2 rounded-lg border text-xs font-medium cursor-pointer ${
                        quizDifficulty === d.id
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold'
                          : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    {ambientEnabled ? (
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <span>Classroom Ambient Audio · વર્ગખંડ શાંત નાદ</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAmbientEnabled(!ambientEnabled)}
                    className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      ambientEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    {ambientEnabled ? 'Enabled · ચાલુ' : 'Muted · બંધ'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {AMBIENT_SOUNDSCAPES.map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setAmbientSoundscape(sc.id as AmbientSoundscapeId)}
                      className={`px-2.5 py-2 rounded-lg border text-left transition-colors cursor-pointer ${
                        ambientSoundscape === sc.id
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-semibold truncate">{sc.labelGu}</div>
                      <div className="text-[11px] text-slate-400 truncate">{sc.labelEn}</div>
                    </button>
                  ))}
                </div>

                <label className="block space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Background Volume · અવાજનું સ્તર</span>
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

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-300">
                    Click &amp; Quiz Sound Effects · ક્લિક અને ક્વિઝ સાઉન્ડ
                  </span>
                  <button
                    type="button"
                    onClick={() => setSfxEnabled(!sfxEnabled)}
                    className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      sfxEnabled
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {sfxEnabled ? 'On · ચાલુ' : 'Off · બંધ'}
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleAddCustomQuestion}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    Create Custom Question · નવો પ્રશ્ન ઉમેરો
                  </span>
                  {formSavedMsg && (
                    <span className="text-emerald-400 font-medium">Question Added</span>
                  )}
                </div>

                <input
                  type="text"
                  required
                  value={qTextGu}
                  onChange={(e) => setQTextGu(e.target.value)}
                  placeholder="પ્રશ્ન લખો (e.g. રાણીની વાવ કયા જિલ્લામાં છે?)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                />

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={qDistrictId}
                    onChange={(e) => setQDistrictId(e.target.value)}
                    className="px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                  >
                    {DISTRICTS_DB.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nameGu} ({d.nameEn})
                      </option>
                    ))}
                  </select>

                  <select
                    value={qMode}
                    onChange={(e) => setQMode(e.target.value as QuizMode)}
                    className="px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                  >
                    <option value="identification">District Identification</option>
                    <option value="headquarters">District Headquarters</option>
                    <option value="rivers">Rivers</option>
                    <option value="attractions">Tourist Places</option>
                    <option value="economy">Agriculture & Industries</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={optA}
                    onChange={(e) => setOptA(e.target.value)}
                    placeholder="Option A"
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                  />
                  <input
                    type="text"
                    required
                    value={optB}
                    onChange={(e) => setOptB(e.target.value)}
                    placeholder="Option B"
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                  />
                  <input
                    type="text"
                    required
                    value={optC}
                    onChange={(e) => setOptC(e.target.value)}
                    placeholder="Option C"
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                  />
                  <input
                    type="text"
                    required
                    value={optD}
                    onChange={(e) => setOptD(e.target.value)}
                    placeholder="Option D"
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={correctIdx}
                    onChange={(e) => setCorrectIdx(Number(e.target.value))}
                    className="px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                  >
                    <option value={0}>Correct: Option A</option>
                    <option value={1}>Correct: Option B</option>
                    <option value={2}>Correct: Option C</option>
                    <option value={3}>Correct: Option D</option>
                  </select>
                  <input
                    type="text"
                    value={qExplain}
                    onChange={(e) => setQExplain(e.target.value)}
                    placeholder="સમજૂતી (Explanation)"
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Custom Question</span>
                </button>
              </form>

              {customQuestions.length > 0 && (
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {customQuestions.map((cq) => (
                    <div
                      key={cq.id}
                      className="flex items-center justify-between gap-2 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs"
                    >
                      <span className="truncate text-slate-200">{cq.question.gu}</span>
                      <button
                        type="button"
                        onClick={() => deleteCustomQuestion(cq.id)}
                        className="text-rose-400 hover:text-rose-300 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
