import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Download,
  MapPin,
  RotateCcw,
  Star,
  Trophy,
  X,
  XCircle,
} from 'lucide-react';
import { DISTRICT_BY_ID } from '../../data/districtsDatabase';
import { generateQuizSession } from '../../data/quizQuestions';
import { useStudioStore } from '../../store/useStudioStore';
import { QuizMode, QuizQuestion } from '../../types/gujarat';
import { soundEffects } from '../../utils/soundEffects';

const QUIZ_MODES: { id: QuizMode; labelGu: string; labelEn: string }[] = [
  { id: 'identification', labelGu: '૧. જિલ્લા ઓળખ', labelEn: 'District Identification' },
  { id: 'findOnMap', labelGu: '૨. નકશા પર જિલ્લો શોધો', labelEn: 'Find the District (3D Map)' },
  { id: 'headquarters', labelGu: '૩. જિલ્લાનું મુખ્ય મથક', labelEn: 'District Headquarters' },
  { id: 'rivers', labelGu: '૪. નદી ઓળખ', labelEn: 'River Identification' },
  { id: 'attractions', labelGu: '૫. જોવાલાયક સ્થળો', labelEn: 'Tourist Places' },
  { id: 'economy', labelGu: '૬. ખેતી અને ઉદ્યોગો', labelEn: 'Agriculture & Industries' },
  { id: 'mapChallenge', labelGu: '૭. નકશા પડકાર', labelEn: 'Map Challenge' },
];

type QuizStage = 'setup' | 'playing' | 'summary';

function computeStars(accuracyPct: number): number {
  if (accuracyPct >= 90) return 5;
  if (accuracyPct >= 75) return 4;
  if (accuracyPct >= 55) return 3;
  if (accuracyPct >= 35) return 2;
  return 1;
}

export const QuizGameModal: React.FC = () => {
  const appMode = useStudioStore((s) => s.appMode);
  const setAppMode = useStudioStore((s) => s.setAppMode);
  const language = useStudioStore((s) => s.language);
  const quizDifficulty = useStudioStore((s) => s.quizDifficulty);
  const customQuestions = useStudioStore((s) => s.customQuestions);
  const recordQuizResult = useStudioStore((s) => s.recordQuizResult);
  const setQuizMapHooks = useStudioStore((s) => s.setQuizMapHooks);
  const setShowLabels = useStudioStore((s) => s.setShowLabels);

  const [stage, setStage] = useState<QuizStage>('setup');
  const [studentName, setStudentName] = useState('વિદ્યાર્થી (Student)');
  const [selectedMode, setSelectedMode] = useState<QuizMode>('identification');
  const [questionCount, setQuestionCount] = useState<10 | 20 | 34>(10);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [mapClickedDistrictId, setMapClickedDistrictId] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [score, setScore] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);

  const currentQuestion = questions[currentIndex] ?? null;

  // Timer during gameplay
  useEffect(() => {
    if (appMode !== 'quiz' || stage !== 'playing') return;
    const timer = window.setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [appMode, stage]);

  // Wire 3D map interaction hooks for Quiz Mode
  useEffect(() => {
    if (appMode !== 'quiz' || stage !== 'playing' || !currentQuestion) {
      setQuizMapHooks({ targetId: null, highlightId: null, onClick: null });
      return;
    }

    // Hide labels during Find-the-District so students truly test map knowledge until answered!
    if (currentQuestion.isMapClickChallenge && !answered) {
      setShowLabels(false);
    } else if (answered) {
      setShowLabels(true);
    }

    const handleMapDistrictClick = (clickedId: string) => {
      if (answered) return;
      if (!currentQuestion.isMapClickChallenge) return;

      const correct = clickedId === currentQuestion.districtId;
      soundEffects.playQuizFeedback(correct);
      setMapClickedDistrictId(clickedId);
      setAnswered(true);
      setIsCorrect(correct);
      if (correct) {
        setCorrectCount((c) => c + 1);
        setScore((s) => s + 10);
      } else {
        setIncorrectCount((c) => c + 1);
      }
    };

    setQuizMapHooks({
      targetId: currentQuestion.districtId,
      highlightId: answered ? currentQuestion.districtId : null,
      onClick: currentQuestion.isMapClickChallenge ? handleMapDistrictClick : null,
    });
  }, [appMode, stage, currentQuestion, answered, setQuizMapHooks, setShowLabels]);

  // Clean up quiz hooks when leaving quiz mode
  useEffect(() => {
    if (appMode !== 'quiz') {
      setQuizMapHooks({ targetId: null, highlightId: null, onClick: null });
      setShowLabels(true);
    }
  }, [appMode, setQuizMapHooks, setShowLabels]);

  const accuracyPct = useMemo(() => {
    if (questions.length === 0) return 0;
    return Math.round((correctCount / questions.length) * 100);
  }, [correctCount, questions.length]);

  const stars = computeStars(accuracyPct);

  if (appMode !== 'quiz') return null;

  const startQuiz = () => {
    const generated = generateQuizSession(
      selectedMode,
      questionCount,
      quizDifficulty,
      customQuestions
    );
    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setMapClickedDistrictId(null);
    setAnswered(false);
    setIsCorrect(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setScore(0);
    setElapsedSec(0);
    setStage('playing');
  };

  const handleOptionSelect = (optIdx: number) => {
    if (answered || !currentQuestion) return;
    const correct = optIdx === currentQuestion.correctIndex;
    soundEffects.playQuizFeedback(correct);
    setSelectedOption(optIdx);
    setAnswered(true);
    setIsCorrect(correct);
    if (correct) {
      setCorrectCount((c) => c + 1);
      setScore((s) => s + 10);
    } else {
      setIncorrectCount((c) => c + 1);
    }
  };

  const handleRetryCurrent = () => {
    if (!answered) return;
    if (isCorrect) setCorrectCount((c) => Math.max(0, c - 1));
    else setIncorrectCount((c) => Math.max(0, c - 1));
    if (isCorrect) setScore((s) => Math.max(0, s - 10));

    setSelectedOption(null);
    setMapClickedDistrictId(null);
    setAnswered(false);
    setIsCorrect(false);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      recordQuizResult({
        id: `quiz-${Date.now()}`,
        studentName: studentName.trim() || 'Student',
        mode: selectedMode,
        difficulty: quizDifficulty,
        totalQuestions: questions.length,
        correctCount,
        incorrectCount,
        score,
        stars,
        durationSec: elapsedSec,
        timestamp: new Date().toISOString(),
      });
      setStage('summary');
      setShowLabels(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedOption(null);
    setMapClickedDistrictId(null);
    setAnswered(false);
    setIsCorrect(false);
  };

  const downloadCertificatePng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark navy & gold certificate design
    ctx.fillStyle = '#060B16';
    ctx.fillRect(0, 0, 1200, 800);

    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 8;
    ctx.strokeRect(36, 36, 1128, 728);

    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.strokeRect(54, 54, 1092, 692);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#38BDF8';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('GUJARAT DISTRICT VFX STUDIO', 600, 130);

    ctx.fillStyle = '#FDE047';
    ctx.font = '700 46px "Noto Sans Gujarati", "Outfit", sans-serif';
    ctx.fillText('ગુજરાત ભૂગોળ ક્વિઝ પ્રમાણપત્ર', 600, 200);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 600, 245);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '500 26px "Noto Sans Gujarati", sans-serif';
    ctx.fillText('આ પ્રમાણપત્ર ગૌરવપૂર્વક એનાયત કરવામાં આવે છે:', 600, 325);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 48px "Noto Sans Gujarati", "Outfit", sans-serif';
    ctx.fillText(studentName.trim() || 'Student', 600, 395);

    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(320, 420, 560, 2);

    const modeObj = QUIZ_MODES.find((m) => m.id === selectedMode);
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '500 24px "Noto Sans Gujarati", sans-serif';
    ctx.fillText(
      `વિભાગ: ${modeObj?.labelGu ?? ''} (${modeObj?.labelEn ?? ''})`,
      600,
      480
    );

    ctx.fillStyle = '#FDE047';
    ctx.font = '700 32px "JetBrains Mono", monospace';
    ctx.fillText(
      `SCORE: ${score} / ${questions.length * 10}   |   ACCURACY: ${accuracyPct}%   |   STARS: ${stars}/5`,
      600,
      545
    );

    ctx.fillStyle = '#94A3B8';
    ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `Correct: ${correctCount} · Total Questions: ${questions.length} · Time: ${elapsedSec}s · Date: ${new Date().toLocaleDateString()}`,
      600,
      610
    );

    ctx.fillStyle = '#38BDF8';
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Gujarat State Geography Educational Program', 600, 690);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gujarat-quiz-certificate-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  // Setup Screen
  if (stage === 'setup') {
    return (
      <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-[#040812]/80">
        <div className="w-[min(640px,95vw)] max-h-[88vh] overflow-y-auto rounded-2xl bg-[#080e1d] border border-cyan-500/30 p-6 shadow-2xl space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-cyan-300 font-medium">
                Gujarat Geography Quiz · ગુજરાત ભૂગોળ ક્વિઝ
              </p>
              <h2 className="font-display text-2xl font-bold text-white mt-1">
                School Quiz Game
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setAppMode('explore')}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-300">
                વિદ્યાર્થીનું નામ (Student Name for Certificate)
              </span>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="તમારું નામ લખો..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </label>

            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-300">
                ક્વિઝ મોડ પસંદ કરો (7 Modes)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUIZ_MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMode(m.id)}
                    className={`text-left px-3.5 py-2.5 rounded-lg border transition-colors cursor-pointer ${
                      selectedMode === m.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm font-semibold">{m.labelGu}</div>
                    <div className="text-xs text-slate-400">{m.labelEn}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-300">
                પ્રશ્નોની સંખ્યા (Question Count)
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {([10, 20, 34] as const).map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`py-2.5 rounded-lg border font-mono-tabular text-sm font-semibold transition-colors cursor-pointer ${
                      questionCount === cnt
                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setAppMode('explore')}
              className="px-4 py-2.5 rounded-lg bg-slate-800 text-slate-200 text-sm font-medium hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={startQuiz}
              className="px-6 py-2.5 rounded-lg bg-cyan-500 text-slate-950 text-sm font-semibold hover:bg-cyan-400 cursor-pointer"
            >
              ક્વિઝ શરૂ કરો · Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Summary & Certificate Screen
  if (stage === 'summary') {
    return (
      <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-[#040812]/80">
        <div className="w-[min(560px,95vw)] rounded-2xl bg-[#080e1d] border border-amber-400/40 p-6 shadow-2xl space-y-5 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-400/15 text-amber-300 mx-auto">
            <Trophy className="w-7 h-7" />
          </div>

          <div>
            <p className="text-xs text-cyan-300 font-medium">
              ક્વિઝ પરિણામ · Result Certificate
            </p>
            <h2 className="font-display text-2xl font-bold text-white mt-1">
              {studentName || 'Student'}
            </h2>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-800 font-mono-tabular">
            <div>
              <div className="text-xs text-slate-400">Score</div>
              <div className="text-xl font-bold text-cyan-300">
                {score} / {questions.length * 10}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Correct</div>
              <div className="text-xl font-bold text-emerald-400">
                {correctCount} / {questions.length}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Time</div>
              <div className="text-xl font-bold text-slate-200">{elapsedSec}s</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={downloadCertificatePng}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 text-slate-950 text-sm font-semibold hover:bg-amber-300 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Certificate (PNG)</span>
            </button>
            <button
              type="button"
              onClick={() => setStage('setup')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 text-slate-950 text-sm font-semibold hover:bg-cyan-400 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
            <button
              type="button"
              onClick={() => setAppMode('explore')}
              className="px-4 py-2.5 rounded-lg bg-slate-800 text-slate-200 text-sm font-medium hover:bg-slate-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Playing Sidebar (keeps 3D Gujarat Map visible & clickable on the left!)
  const progressPct = Math.round(((currentIndex + (answered ? 1 : 0)) / questions.length) * 100);
  const targetDistrict = currentQuestion ? DISTRICT_BY_ID[currentQuestion.districtId] : null;
  const clickedDistrict = mapClickedDistrictId ? DISTRICT_BY_ID[mapClickedDistrictId] : null;

  return (
    <aside className="absolute top-4 right-4 bottom-4 w-[min(430px,92vw)] z-20 rounded-xl bg-[#080e1d]/95 border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden">
      {/* Quiz Header & Scoreboard */}
      <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4 font-mono-tabular text-xs">
          <span className="text-cyan-300 font-semibold">
            Q {currentIndex + 1}/{questions.length}
          </span>
          <span className="text-amber-300 font-semibold">Score: {score}</span>
          <span className="inline-flex items-center gap-1 text-slate-300">
            <Clock className="w-3.5 h-3.5" />
            {elapsedSec}s
          </span>
        </div>
        <button
          type="button"
          onClick={() => setStage('setup')}
          className="text-xs text-slate-400 hover:text-white cursor-pointer"
        >
          Exit Quiz
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-900 w-full">
        <div
          className="h-full bg-cyan-400 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question Body */}
      {currentQuestion && (
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="text-xs text-cyan-300/90 font-medium flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>{QUIZ_MODES.find((m) => m.id === currentQuestion.mode)?.labelGu}</span>
          </div>

          <h3 className="font-display text-lg font-semibold text-white leading-snug">
            {currentQuestion.question[language]}
          </h3>

          {currentQuestion.isMapClickChallenge ? (
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-medium text-sm">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>ડાબી બાજુના 3D નકશા પર જિલ્લો ક્લિક કરો</span>
              </div>
              <p className="text-xs text-slate-300">
                Click directly on the district on the 3D Gujarat Map. You can rotate and zoom the map freely.
              </p>
              {answered && clickedDistrict && !isCorrect && (
                <p className="text-xs text-rose-300 pt-1">
                  તમે ક્લિક કરેલ જિલ્લો: {clickedDistrict.nameGu} ({clickedDistrict.nameEn})
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt, idx) => {
                const isRightOption = idx === currentQuestion.correctIndex;
                const isPicked = idx === selectedOption;
                let btnStyle =
                  'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-cyan-500/50';
                if (answered) {
                  if (isRightOption) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
                  } else if (isPicked) {
                    btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-900/40 border-slate-800/60 text-slate-500';
                  }
                }
                const letter = ['A', 'B', 'C', 'D'][idx];

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={answered}
                    onClick={() => handleOptionSelect(idx)}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors flex items-center justify-between gap-2 cursor-pointer disabled:cursor-default ${btnStyle}`}
                  >
                    <span>
                      <strong className="font-mono-tabular mr-2 text-cyan-300">{letter}.</strong>
                      {opt[language]}
                    </span>
                    {answered && isRightOption && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {answered && isPicked && !isRightOption && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Answer Feedback & Explanation */}
          {answered && (
            <div
              className={`p-4 rounded-xl border space-y-2 ${
                isCorrect
                  ? 'bg-emerald-500/10 border-emerald-500/40'
                  : 'bg-rose-500/10 border-rose-500/40'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-sm">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">સાચો જવાબ! (+10 Points)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-300">
                      ખોટો જવાબ — સાચો જિલ્લો: {targetDistrict?.nameGu} ({targetDistrict?.nameEn})
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {currentQuestion.explanation[language]}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="px-5 py-3.5 border-t border-slate-800 flex items-center justify-between gap-2 bg-[#060b16]">
        <button
          type="button"
          disabled={!answered}
          onClick={handleRetryCurrent}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Question</span>
        </button>

        <button
          type="button"
          disabled={!answered}
          onClick={handleNext}
          className="px-5 py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-semibold hover:bg-cyan-400 disabled:opacity-40 cursor-pointer"
        >
          {currentIndex + 1 >= questions.length ? 'Finish & Certificate' : 'આગળનો પ્રશ્ન · Next'}
        </button>
      </div>
    </aside>
  );
};
