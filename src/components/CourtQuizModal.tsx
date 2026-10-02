import React, { useState } from 'react';
import { COURT_TABOO_QUIZ, HeritageQuizOption } from '../data/heritageData';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Crown, 
  X, 
  ChevronRight, 
  RotateCcw, 
  Sparkles, 
  ShieldAlert,
  Award,
  Flame,
  ArrowRight
} from 'lucide-react';

interface CourtQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CourtQuizModal: React.FC<CourtQuizModalProps> = ({ isOpen, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userScore, setUserScore] = useState<number>(100); // Base starting score
  const [scoreDelta, setScoreDelta] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<HeritageQuizOption | null>(null);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState<boolean>(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [answeredHistory, setAnsweredHistory] = useState<{
    questionId: string;
    isCorrect: boolean;
    pointsChange: number;
  }[]>([]);

  if (!isOpen) return null;

  const currentQuestion = COURT_TABOO_QUIZ[currentIdx];

  const handleSelectOption = (opt: HeritageQuizOption) => {
    if (selectedOption !== null) return; // Prevent multiple clicks on same question

    setSelectedOption(opt);
    setScoreDelta(opt.pointsChange);
    setUserScore(prev => Math.max(0, prev + opt.pointsChange));

    setAnsweredHistory(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        isCorrect: opt.isCorrect,
        pointsChange: opt.pointsChange
      }
    ]);

    // Open immediate Popup (Green for correct, Red for taboo violation)
    setShowFeedbackPopup(true);
  };

  const handleNextQuestion = () => {
    setShowFeedbackPopup(false);
    setSelectedOption(null);
    setScoreDelta(null);

    if (currentIdx < COURT_TABOO_QUIZ.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setUserScore(100);
    setScoreDelta(null);
    setSelectedOption(null);
    setShowFeedbackPopup(false);
    setIsQuizCompleted(false);
    setAnsweredHistory([]);
  };

  const correctCount = answeredHistory.filter(a => a.isCorrect).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#121218] border border-[#2b2b3b] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 relative shadow-2xl">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-[#222230] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 text-[#e5c365] flex items-center justify-center border border-[#c5a059]/30">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#c5a059] font-medium tracking-wide">
                Thử Thách Check Phạm Húy Triều Đình
              </span>
              <h3 className="text-lg font-bold text-[#f5f2eb]">
                Khảo Thí Y Quan Triều Nguyễn
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[11px] text-stone-400">Điểm Di Sản</div>
              <div className="text-sm font-bold text-[#e5c365] flex items-center gap-1 justify-end">
                <span>{userScore}đ</span>
                {scoreDelta !== null && (
                  <span className={`text-xs ${scoreDelta > 0 ? 'text-emerald-400' : 'text-rose-400 animate-bounce'}`}>
                    ({scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta})
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#1c1c26] text-stone-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* QUIZ IN PROGRESS */}
        {!isQuizCompleted ? (
          <div className="space-y-6">
            
            {/* Question Header & Context */}
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="text-[#c5a059] font-semibold">
                {currentQuestion.scenarioContext}
              </span>
              <span>
                Câu {currentIdx + 1} / {COURT_TABOO_QUIZ.length}
              </span>
            </div>

            {/* Question Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#171722] border border-[#29293a] space-y-2">
              <span className="text-xs font-bold text-[#c5a059]">Câu hỏi {currentQuestion.questionNumber}:</span>
              <h4 className="text-sm sm:text-base font-bold text-[#f5f2eb] leading-relaxed">
                {currentQuestion.question}
              </h4>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  disabled={selectedOption !== null}
                  className="w-full text-left p-4 rounded-xl bg-[#14141d] hover:bg-[#1a1a27] border border-[#242436] hover:border-[#c5a059]/60 transition-all text-xs sm:text-sm text-stone-200 cursor-pointer disabled:opacity-60 flex items-start justify-between gap-3 group active:scale-[0.99]"
                >
                  <span className="leading-relaxed group-hover:text-white transition-colors">
                    {opt.text}
                  </span>
                  <div className="shrink-0 w-6 h-6 rounded-full border border-stone-600 flex items-center justify-center group-hover:border-[#c5a059]">
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#c5a059] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              ))}
            </div>

            {/* Guidance Footer */}
            <div className="text-[11px] text-stone-400 italic text-center pt-2">
              💡 Hãy cân nhắc kỹ: chọn sai quy chuẩn sẽ bị trừ điểm theo Bộ Lọc Cốt Lõi Taboos Engine!
            </div>

          </div>
        ) : (
          /* QUIZ SUMMARY / RESULTS */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#c5a059]/20 text-[#e5c365] mx-auto flex items-center justify-center border-2 border-[#c5a059] text-2xl shadow-lg">
              👑
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#c5a059] font-bold">
                TỔNG KẾT ĐIỂM SỐ HOÀNG TRIỀU
              </span>
              <h3 className="text-2xl font-bold text-[#f5f2eb]">
                {userScore >= 110
                  ? 'Trạng Nguyên Mix Đồ Hoàng Triều'
                  : userScore >= 90
                  ? 'Thượng Thư Bắt Trend Di Sản'
                  : 'Sĩ Tử Cần Bồi Dưỡng Y Quan'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                Bạn đã vượt qua {correctCount} / {COURT_TABOO_QUIZ.length} câu hỏi với tổng điểm số{' '}
                <strong className="text-[#e5c365]">{userScore} điểm</strong>.
              </p>
            </div>

            {/* Score pill breakdown */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-xs">
              <div className="p-3 rounded-xl bg-[#161620] border border-[#242436] text-stone-300">
                <div>Câu Đúng</div>
                <div className="text-base font-bold text-emerald-400 mt-1">{correctCount} câu</div>
              </div>
              <div className="p-3 rounded-xl bg-[#161620] border border-[#242436] text-stone-300">
                <div>Phạm Húy</div>
                <div className="text-base font-bold text-rose-400 mt-1">
                  {COURT_TABOO_QUIZ.length - correctCount} câu
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleRestartQuiz}
                className="px-5 py-2.5 rounded-xl bg-[#1c1c28] hover:bg-[#252535] text-stone-200 border border-[#2e2e40] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Thử thách lại</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b566] text-[#0e0e12] text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Tiếp tục phối đồ
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* FEEDBACK POPUP: GREEN FOR CORRECT, RED FOR TABOO WARNING */}
        {/* ======================================================== */}
        {showFeedbackPopup && selectedOption && (
          <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div
              className={`rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 border shadow-2xl relative animate-scaleUp ${
                selectedOption.isCorrect
                  ? 'bg-[#0f1f18] border-emerald-500/70 shadow-emerald-950/50'
                  : 'bg-[#261014] border-rose-500/80 shadow-rose-950/60'
              }`}
            >
              {/* Header Badge */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    selectedOption.isCorrect
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                  }`}
                >
                  {selectedOption.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        selectedOption.isCorrect
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {selectedOption.isCorrect
                        ? `+${selectedOption.pointsChange} ĐIỂM`
                        : `${selectedOption.pointsChange} ĐIỂM`}
                    </span>
                  </div>
                  <h4
                    className={`text-lg sm:text-xl font-bold mt-1 tracking-tight ${
                      selectedOption.isCorrect ? 'text-emerald-200' : 'text-rose-200'
                    }`}
                  >
                    {selectedOption.badgeTitle}
                  </h4>
                </div>
              </div>

              {/* Cultural Explanation */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div
                  className={`p-4 rounded-xl border leading-relaxed ${
                    selectedOption.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-100'
                      : 'bg-rose-950/50 border-rose-500/30 text-rose-100'
                  }`}
                >
                  <p className="font-medium">{selectedOption.culturalExplanation}</p>
                </div>

                {/* Stylist Persona Quote */}
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed italic ${
                    selectedOption.isCorrect
                      ? 'bg-black/30 border-emerald-500/20 text-[#faedd0]'
                      : 'bg-black/40 border-rose-500/20 text-[#fde2e4]'
                  }`}
                >
                  <span className="font-bold not-italic block mb-1 text-[#e5c365]">
                    Stylist Cổ Phục Viễn Đông nhắn nhủ:
                  </span>
                  “{selectedOption.stylistFeedback}”
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
                    selectedOption.isCorrect
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950'
                      : 'bg-[#c5a059] hover:bg-[#d8b566] text-[#0e0e12]'
                  }`}
                >
                  <span>{currentIdx < COURT_TABOO_QUIZ.length - 1 ? 'Câu Tiếp Theo' : 'Xem Tổng Kết Điểm'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
