import React, { useState } from 'react';
import { HERITAGE_STORIES, COURT_TABOO_QUIZ, HeritageQuizOption } from '../data/heritageData';
import { RobeVisualizer } from './RobeVisualizer';
import { 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  Award, 
  ChevronRight, 
  Flame, 
  Check, 
  X,
  Compass,
  Layers,
  CircleDot,
  Crown,
  Waves,
  AlertTriangle,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

export const HeritageStory: React.FC = () => {
  const [selectedStoryId, setSelectedStoryId] = useState<string>('story-5-panels');
  const [interactiveHotspot, setInteractiveHotspot] = useState<string>('panels');
  const [activeGarmentTab, setActiveGarmentTab] = useState<'ngu_than' | 'nhat_binh'>('ngu_than');

  // Interactive Quiz states
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(100);
  const [scoreDelta, setScoreDelta] = useState<number | null>(null);
  const [selectedOpt, setSelectedOpt] = useState<HeritageQuizOption | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  const activeStory = HERITAGE_STORIES.find(s => s.id === selectedStoryId) || HERITAGE_STORIES[0];
  const currentQuiz = COURT_TABOO_QUIZ[quizIdx];

  const handleSelectHotspot = (hotspot: string) => {
    setInteractiveHotspot(hotspot);
    if (hotspot === 'collar') {
      setSelectedStoryId('story-don-y');
    } else if (hotspot === 'buttons') {
      setSelectedStoryId('story-5-buttons');
    } else if (hotspot === 'panels') {
      setSelectedStoryId('story-5-panels');
    } else if (hotspot === 'pattern') {
      setSelectedStoryId('story-phuong-o');
    }
  };

  const getStoryIcon = (name: string) => {
    switch (name) {
      case 'Shield': return <ShieldCheck className="w-5 h-5 text-[#c5a059]" />;
      case 'CircleDot': return <CircleDot className="w-5 h-5 text-[#c5a059]" />;
      case 'Crown': return <Crown className="w-5 h-5 text-[#c5a059]" />;
      case 'Waves': return <Waves className="w-5 h-5 text-[#c5a059]" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#c5a059]" />;
      default: return <BookOpen className="w-5 h-5 text-[#c5a059]" />;
    }
  };

  const handleSelectQuizOption = (opt: HeritageQuizOption) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(opt);
    setScoreDelta(opt.pointsChange);
    setQuizScore(prev => Math.max(0, prev + opt.pointsChange));
    if (opt.isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    setShowPopup(true);
  };

  const handleNextQuizQuestion = () => {
    setShowPopup(false);
    setSelectedOpt(null);
    setScoreDelta(null);

    if (quizIdx < COURT_TABOO_QUIZ.length - 1) {
      setQuizIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizIdx(0);
    setQuizScore(100);
    setScoreDelta(null);
    setSelectedOpt(null);
    setShowPopup(false);
    setQuizFinished(false);
    setCorrectAnswers(0);
  };

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="relative border-b border-[#24242d] pb-6 pt-2">
        <div className="text-xs text-[#c5a059] font-medium tracking-wide mb-1">
          Di Sản Story · Tri Thức Cung Đình
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f5f2eb]">
          Ý Nghĩa Triết Lý Y Quan Triều Nguyễn
        </h1>
        <p className="mt-2 text-stone-300 text-sm max-w-2xl leading-relaxed">
          Giải mã 5 thân áo, 5 cúc Ngũ Thường, hoa văn Phượng Ổ, Thủy Ba Tam Sơn bằng góc nhìn trẻ trung, dí dỏm nhưng chuẩn mực nghiên cứu lịch sử.
        </p>
      </div>

      {/* SECTION 1: INTERACTIVE ROBE EXPLORER */}
      <div className="bg-[#141418] border border-[#23232c] rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#202028] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#f5f2eb]">
              Khám Phá Chi Tiết Trên Thân Áo
            </h3>
            <span className="text-xs text-stone-400">Chạm vào điểm tròn để tra cứu ý nghĩa</span>
          </div>

          {/* Garment Switcher */}
          <div className="flex items-center p-1 bg-[#0d0d12] rounded-lg border border-[#242430]">
            <button
              onClick={() => {
                setActiveGarmentTab('ngu_than');
                setSelectedStoryId('story-5-panels');
              }}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                activeGarmentTab === 'ngu_than'
                  ? 'bg-[#c5a059] text-[#0d0d12]'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Áo Ngũ Thân
            </button>
            <button
              onClick={() => {
                setActiveGarmentTab('nhat_binh');
                setSelectedStoryId('story-phuong-o');
              }}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                activeGarmentTab === 'nhat_binh'
                  ? 'bg-[#c5a059] text-[#0d0d12]'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Áo Nhật Bình
            </button>
          </div>
        </div>

        {/* Visualizer & Dynamic Detail Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          
          {/* Visualizer with interactive hotspot dots */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <RobeVisualizer
              type={activeGarmentTab === 'ngu_than' ? 'ngu_than' : 'nhat_binh'}
              primaryColor={activeGarmentTab === 'ngu_than' ? '#1e3a5f' : '#7a1f2b'}
              hasDonY={true}
              buttonType="btn-metal-copper"
              interactive={true}
              activeHotspot={interactiveHotspot}
              onSelectHotspot={handleSelectHotspot}
            />
            <p className="text-xs text-stone-400 mt-2 text-center">
              💡 Bấm vào điểm tròn vàng trên áo để tra cứu ý nghĩa.
            </p>
          </div>

          {/* Detailed Hotspot Explanation */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-xl bg-[#0f0f14] border border-[#242430] space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center border border-[#c5a059]/30 shrink-0">
                  {getStoryIcon(activeStory.iconName)}
                </div>
                <div>
                  <span className="text-xs text-[#c5a059]">
                    {activeStory.tagline}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#f5f2eb]">
                    {activeStory.title}
                  </h3>
                </div>
              </div>

              {/* Gen Z Persona Callout */}
              <div className="p-3.5 rounded-lg bg-[#14141e] border-l-2 border-[#c5a059] text-xs text-stone-200 italic leading-relaxed">
                {activeStory.genZTone}
              </div>

              {/* Deep Dive Historical Fact */}
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {activeStory.deepDive}
              </p>

              {/* 3 Key Breakdown Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#1e1e28]">
                {activeStory.points.map((pt, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#0a0a0e] border border-[#1d1d24]">
                    <div className="text-xs font-bold text-[#c5a059] mb-0.5">{pt.label}</div>
                    <div className="text-xs text-stone-400 leading-normal">{pt.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: 6 ARCHIVAL STORY CARDS */}
      <div className="space-y-4">
        <div>
          <span className="text-xs text-[#c5a059] font-medium tracking-wide">
            Kho tài liệu văn hóa
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f5f2eb] mt-0.5">
            6 Quy Tắc Cốt Lõi Định Hình Bản Sắc
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HERITAGE_STORIES.map((story) => {
            const isSelected = selectedStoryId === story.id;
            return (
              <div
                key={story.id}
                onClick={() => {
                  setSelectedStoryId(story.id);
                  if (story.id === 'story-phuong-o' || story.id === 'story-thuy-ba') {
                    setActiveGarmentTab('nhat_binh');
                  } else {
                    setActiveGarmentTab('ngu_than');
                  }
                }}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1b1b22] border-[#c5a059] shadow-sm'
                    : 'bg-[#141418] border-[#22222a] hover:border-[#383848]'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center border border-[#c5a059]/25">
                      {getStoryIcon(story.iconName)}
                    </div>
                    {isSelected && (
                      <span className="text-xs px-2 py-0.5 rounded bg-[#c5a059]/20 text-[#e5c365] font-semibold">
                        Đang xem
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-[#f5f2eb]">
                    {story.title}
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
                    {story.deepDive}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-[#202028] flex items-center justify-between text-xs text-[#c5a059] font-medium">
                  <span>Khám phá triết lý</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: QUICK 1-MINUTE CULTURAL KNOWLEDGE CHECK */}
      <div className="bg-[#141418] border border-[#2a241e] rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24201a] pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#e5c365] font-medium">
              <Award className="w-4 h-4" />
              <span>Thử thách 1 phút</span>
            </div>
            <h3 className="text-lg font-bold text-[#f5f2eb] mt-0.5">
              Check Xem Bạn Có Phạm Húy Triều Đình?
            </h3>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-xs text-stone-300">
              Điểm số: <span className="font-bold text-[#e5c365]">{quizScore}đ</span>
            </div>
            {!quizFinished && (
              <div className="text-xs text-stone-400">
                Câu hỏi: {quizIdx + 1} / {COURT_TABOO_QUIZ.length}
              </div>
            )}
          </div>
        </div>

        {!quizFinished ? (
          <div className="space-y-4 pt-1">
            <div className="p-4 rounded-xl bg-[#0e0e13] border border-[#26201a] space-y-1">
              <div className="flex items-center justify-between text-xs text-[#c5a059] font-semibold">
                <span>Câu hỏi {currentQuiz.questionNumber}: {currentQuiz.scenarioContext}</span>
              </div>
              <p className="text-sm font-bold text-[#f5f2eb] mt-1 leading-relaxed">
                {currentQuiz.question}
              </p>
            </div>

            <div className="space-y-2.5">
              {currentQuiz.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectQuizOption(opt)}
                  disabled={selectedOpt !== null}
                  className="w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start justify-between gap-3 cursor-pointer bg-[#101015] border-[#242430] hover:border-[#c5a059]/60 text-stone-200 hover:text-white"
                >
                  <span className="leading-relaxed">{opt.text}</span>
                  <ChevronRight className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                </button>
              ))}
            </div>

            {/* Instruction tooltip */}
            <div className="text-[11px] text-stone-400 italic">
              💡 Bấm chọn đáp án để xem phản hồi và đánh giá từ Stylist Cổ Phục Viễn Đông!
            </div>
          </div>
        ) : (
          /* Quiz Results & Title */
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#c5a059]/20 text-[#e5c365] mx-auto flex items-center justify-center border-2 border-[#c5a059] text-2xl shadow-lg">
              👑
            </div>
            
            <div>
              <span className="text-xs text-stone-400 font-medium">
                Hoàn thành khảo thí · Đạt {quizScore} điểm
              </span>
              <h4 className="text-xl sm:text-2xl text-[#f5f2eb] font-bold mt-1">
                {quizScore >= 110
                  ? 'Trạng Nguyên Mix Đồ Hoàng Triều'
                  : quizScore >= 90
                  ? 'Thượng Thư Bắt Trend Di Sản'
                  : 'Sĩ Tử Cần Ôn Lại Taboos'}
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto mt-2 leading-relaxed">
                {quizScore >= 110
                  ? '“Đỉnh nóc kịch trần luôn bạn hiền ơi! Kiến thức y quan của người đẹp thuộc hàng học sĩ uyên bác, tự tin ra đường phối cổ phục không sợ ai bắt lỗi!”'
                  : '“Kiến thức rất đáng khen nha bạn hiền! Hãy nhớ các quy tắc vàng: không cúc vải Tàu, bắt buộc Đơn Y và tránh màu Vàng Minh Hoàng nhé!”'}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleResetQuiz}
                className="px-5 py-2.5 rounded-xl bg-[#1f1f28] hover:bg-[#282834] text-stone-200 text-xs font-semibold border border-[#2d2d3a] transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại thử thách</span>
              </button>
            </div>
          </div>
        )}

        {/* POPUP FEEDBACK DIALOG (Green for correct, Red for warning) */}
        {showPopup && selectedOpt && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div
              className={`rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-4 border shadow-2xl animate-scaleUp ${
                selectedOpt.isCorrect
                  ? 'bg-[#0f1f18] border-emerald-500/80 shadow-emerald-950/60'
                  : 'bg-[#261014] border-rose-500/80 shadow-rose-950/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    selectedOpt.isCorrect
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                  }`}
                >
                  {selectedOpt.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      selectedOpt.isCorrect
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {selectedOpt.isCorrect
                      ? `+${selectedOpt.pointsChange} ĐIỂM`
                      : `${selectedOpt.pointsChange} ĐIỂM`}
                  </span>
                  <h4
                    className={`text-lg sm:text-xl font-bold mt-0.5 tracking-tight ${
                      selectedOpt.isCorrect ? 'text-emerald-200' : 'text-rose-200'
                    }`}
                  >
                    {selectedOpt.badgeTitle}
                  </h4>
                </div>
              </div>

              {/* Cultural Explanation */}
              <div
                className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                  selectedOpt.isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-100'
                    : 'bg-rose-950/50 border-rose-500/30 text-rose-100'
                }`}
              >
                {selectedOpt.culturalExplanation}
              </div>

              {/* Stylist Quote */}
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed italic ${
                  selectedOpt.isCorrect
                    ? 'bg-black/30 border-emerald-500/20 text-[#faedd0]'
                    : 'bg-black/40 border-rose-500/20 text-[#fde2e4]'
                }`}
              >
                <span className="font-bold not-italic block mb-0.5 text-[#e5c365]">
                  Stylist Cổ Phục Viễn Đông nhắn nhủ:
                </span>
                “{selectedOpt.stylistFeedback}”
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuizQuestion}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                    selectedOpt.isCorrect
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950'
                      : 'bg-[#c5a059] hover:bg-[#d8b566] text-[#0e0e12]'
                  }`}
                >
                  <span>{quizIdx < COURT_TABOO_QUIZ.length - 1 ? 'Câu tiếp theo' : 'Xem tổng kết'}</span>
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
